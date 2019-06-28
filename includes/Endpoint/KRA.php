<?php

namespace Rhythmus\Endpoint;

use Rhythmus;
use Rhythmus\EndpointAuthentication;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * @subpackage REST_Controller
 */
class KRA {

    /**
     * Handle endpoint authentication
     *
     * @var EndpointAuthentication $auth
     */
    protected $auth;

    /**
	 * Instance of this class.
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 */
	private function __construct() {
        $plugin = Rhythmus\Rhythmus::get_instance();
        $this->plugin_slug = $plugin->get_plugin_slug();
        $this->auth = new EndpointAuthentication();
	}

    /**
     * Set up WordPress hooks and filters
     *
     * @return void
     */
    public function do_hooks() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

	/**
	 * Return an instance of this class.
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {
        
        $version = '1';
        $namespace = $this->plugin_slug . '/v' . $version;
        $endpoint = '/kra/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_kra' ),
                'permission_callback'   => array( $this->auth, 'permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * Get Weekly Report Status List
     * Endpoint: https://rhythmus.dev.cc/wp-json/rhythmus/v1/kra/
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_kra( $request ) {
         /**
          * 1. Get a KRA record from the database (SQL)
          * - look at get_kra_topics for example
          * 2. try and make record look like kra.json sample file
          * 3. Send it to the display.
          */

        //Currently reading sample data from a file and returning
        // $sample = json_decode(file_get_contents(__DIR__.'/sample-data/kra.json'));        

         // allows you to request data using the url parameter '?id=XX'
        // used as a placeholder for teammate_id
        $id = $request->get_param('id');
        $id = intval($id);

        global $wpdb;

        // database sql query converted into php
        $query = $wpdb->prepare( "SELECT teammate_id, is_current, position, kra, create_date FROM {$wpdb->prefix}rhythmus_kra WHERE is_current=1 AND teammate_id = %d", $id );

        //captures the results of the sql query
        $row = $wpdb->get_row($query, OBJECT);

        $kra = array(
            "app" => 'Rhythmus',
            "version" => 1
        );
        if($row){
            $kra["kra"] = json_decode($row->kra);    
            $kra["position"] =$row->position;
            $kra["teammate_id"] = $row->teammate_id;
            $kra["create_date"] = $row->create_date;       
        }
        //returns the results as json
        return new \WP_REST_Response( $kra, 200 );

    }
}