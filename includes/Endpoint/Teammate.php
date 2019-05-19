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
class Teammate {
    /**
	 * Instance of this class.
	 *
	 * @since    0.8.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.8.1
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
        $endpoint = '/teammate-list/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_teammate_list' ),
                'permission_callback'   => array( $this, 'logged_in_permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * Get Teammate List
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_teammate_list( $request ) {
        global $wpdb;

        $results = $wpdb->get_results( "SELECT rm.user_id, fname, lname, year, month, total, submitted, reviewed 
        from {$wpdb->prefix}rhythmus_member rm left outer join {$wpdb->prefix}rhythmus_kra_review rkr on rm.user_id = rkr.user_id 
        where rm.is_active = 1 order by fname asc, year desc, month desc", OBJECT );

        $teammates = array ();
        $currUser = false;
        $currUserID = null;
        $currScores = array();
        foreach ( $results as $row ) 
        {
            if($row->user_id != $currUserID) {
                if($currUser) {
                    $currUser["months"] = $currScores;
                    array_push($teammates, $currUser);
                }
                $currUser = array(
                    "name" => $row->fname." ".$row->lname,
                    "userid" => $row->user_id
                );
                $currUserID = $row->user_id;
                $currScores = array();
            }
            $key = $row->year."-".$row->month;
            $currScores[$key] = array(
                "score" => $row->total,
                "reviewed" => ($row->reviewed == 1),
                "submitted" => ($row->submitted == 1),
            );
        }
        if($currUser) {
            $currUser["months"] = $currScores;
            array_push($teammates, $currUser);
        }
        
        $teamlist = array(
            "app" => 'Rhythmus',
            "version" => 1,
            "teammates" => $teammates);
        return new \WP_REST_Response( $teamlist, 200 );
    }
    /**
     * Check if a given request has access
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function logged_in_permissions_check( $request ) {
        $key = base64_decode($_GET['k']);
        if($key && strpos($key, ":") > 0 ) {
            $keyParts = explode(":", $key);
            if($params[1] == get_user_meta($params[0], 'rhythmus-key', true)) {
                return true;
            }
        }
        return false;
    }
}
