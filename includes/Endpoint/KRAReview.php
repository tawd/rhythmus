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
                'permission_callback'   => array( $this, 'kra_permissions_check' ),
                'args'                  => array(),
            ),
        ) );


        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::EDITABLE,
                'callback'              => array( $this, 'update_kra_review' ),
                'permission_callback'   => array( $this, 'kra_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        $endpoint = '/kra-topics/';
        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_kra_topics' ),
                'permission_callback'   => array( $this, 'kra_permissions_check' ),
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
     * Get KRA Topics
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_kra_topics( $request ) {
        //Currently reading sample data from a file and returning
        $sample = json_decode(file_get_contents(__DIR__.'/sample-data/kra-topics.json'));

        return new \WP_REST_Response( $sample, 200 );
    }

    /**
     * Create OR Update 
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_kra_review( $request ) {
        global $wpdb;
        $data = json_decode(file_get_contents('php://input'), true);

        $table_name = $wpdb->prefix . 'rhythmus_kra_review';

        //TODO: Need to check that the teammate_id that is passed in is the current user or supervised or the current user is super admin
        $sql = $wpdb->prepare( "REPLACE INTO $table_name
                (teammate_id, year, month, total, reviewed, review_notes, topics, last_update_date)
                VALUES
                (%d, %d, %d, %d, %d, %s, %s, now())",
                $data['userid'], $data['year'], $data['month'], $data['total'], 
                $data['reviewed'], $data['review_notes'], json_encode($data['topics'])
            );

        $updated = false;
        if( $wpdb->query($sql) ) {
            $updated = true;
        }

        return new \WP_REST_Response( array(
            'success'   => $updated
        ), 200 );
    }

    /**
     * Check if a given request has access
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function kra_permissions_check( $request ) {
        $key = base64_decode($_GET['k']);
        if( $key && strpos($key, ":") > 0 ) {
            $keyParts = explode(":", $key);
            if($params[1] == get_user_meta($params[0], 'rhythmus-key', true)) {
                return true;
            }
        }
        return false;
    }
}
