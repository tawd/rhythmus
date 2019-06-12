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
class KRAVersions {

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
        $endpoint = '/kra-versions/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_kra' ),
                'permission_callback'   => array( $this->auth, 'permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::EDITABLE,
                'callback'              => array( $this, 'update_kra_version' ),
                'permission_callback'   => array( $this->auth, 'permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * Get Weekly Report Status List
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_kra_versions( $request ) {
        //Currently reading sample data from a file and returning
        $sample = json_decode(file_get_contents(__DIR__.'/sample-data/wr-status-list.json'));        
        return new \WP_REST_Response( $sample, 200 );

    }

    /**
     * Create OR Update 
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_kra_version( $request ) {
        
    }
    /**
 * Get current kra info from database
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Request
 */

    public function new_kra( $request ) {
    /**
     * Steps needed to complete
     * 
     * 1. recieve an id
     * 2. make copy the records from that id
     * 3. update old id to 'not current'
     * 4. update new id to 'current'
     * 5. return new version
     */

        $id = $request->get_param('id');   
        $id = intval($id);
        global $wpdb;
        $tm_id = 
        //$query = $wpdb->prepare( "SELECT id, teammate_id, is_current, create_date, last_update_date, position, kra FROM {$wpdb->prefix}rhythmus_kra WHERE id = %d", $id );
        $query = $wpdb->prepare( "INSERT INTO wp_rhythmus_kra (teammate_id, is_current, position) VALUES (%d, 1, %s)", $tm_id, $position);

        $results = $wpdb->get_results($query, OBJECT);




         return new \WP_REST_Response( $results, 200 );

    }
}

   


