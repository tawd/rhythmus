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


/**
 * @subpackage REST_Controller
 */
class KRAReview {
    /**
	 * Instance of this class.
	 *
	 * @since    0.1.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.1.1
	 */
	private function __construct() {
        $plugin = Rhythmus\Rhythmus::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
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
	 * @since     0.8.1
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
        $endpoint = '/kra-review/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_kra_review' ),
                'permission_callback'   => array( $this, 'kra_read_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::CREATABLE,
                'callback'              => array( $this, 'update_kra_review' ),
                'permission_callback'   => array( $this, 'kra_update_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::EDITABLE,
                'callback'              => array( $this, 'update_kra_review' ),
                'permission_callback'   => array( $this, 'kra_update_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::DELETABLE,
                'callback'              => array( $this, 'delete_kra_review' ),
                'permission_callback'   => array( $this, 'kra_update_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

    }

    /**
     * Get KRA Review
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_kra_review( $request ) {
        //Currently reading sample data from a file and returning
        $sample = json_decode(file_get_contents(__DIR__.'/sample-data/kra-teammate-year.json'));

        return new \WP_REST_Response( $sample, 200 );
    }

    /**
     * Create OR Update 
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_kra_review( $request ) {
        $data = json_decode(file_get_contents('php://input'), true);


        //TODO: Finish
        $updated = false;

        return new \WP_REST_Response( array(
            'success'   => $updated,
            'value'     => $updated
        ), 200 );
    }

    /**
     * Delete 
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function delete_kra_review( $request ) {

        //TODO: Finish
        $deleted = false;

        return new \WP_REST_Response( array(
            'success'   => $deleted,
            'value'     => ''
        ), 200 );
    }

    /**
     * Check if a given request has access to read KRA
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function kra_read_permissions_check( $request ) {
        //TODO: Need to make sure user is a logged in teammate
        return true;
    }

   /**
     * Check if a given request has access to update a KRA
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function kra_update_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }
}
