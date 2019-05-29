<?php
/**
 * Rhythmus
 *
 *
 * @package   Rhythmus
 * @author    Todd Watson
 * @license   GPL-3.0
 * @link      https://showit.co
 * @copyright 2019 Showit, Inc
 */

namespace Rhythmus\Endpoint;

use Rhythmus;
use Rhythmus\EndpointAuthentication;
use WP_REST_Request;

/**
 * @subpackage REST_Controller
 */
class WeeklyReport {

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
        $endpoint = '/wr-status-list/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_wr_status_list' ),
                'permission_callback'   => array( $this->auth, 'permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::EDITABLE,
                'callback'              => array( $this, 'update_wr_status' ),
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
    public function get_wr_status_list( $request ) {
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
    public function update_wr_status( $request ) {
        global $wpdb;
        
        $data = $request->get_params();

        // TODO: validation on incoming data
        $status = array_key_exists( 'status', $data ) ? (int) $data['status'] : 0;

        if ( ! array_key_exists( 'teammate_id', $data ) || ! array_key_exists( 'week_id', $data ) ) {
            return new \WP_REST_Response( array(
                'success' => false,
                'message' => 'invalid params',
            ) );
        }

        $teammate_id = $data['teammate_id'];
        $week_id = $data['week_id'];

        $table_name = $wpdb->prefix . 'rhythmus_weekly_report';

        // TODO: What data are we going to use as an update key?
        $sql = $wpdb->prepare( "UPDATE $table_name SET status = %d WHERE teammate_id = %d AND week_id = %d", $status, $teammate_id, $week_id );

        $updated = false;
        if( $wpdb->query($sql) ) {
            $updated = true;
        }

        // TODO: We should probably create a common response format.
        return new \WP_REST_Response( array(
            'success'   => $updated
        ), 200 );
    }
}
