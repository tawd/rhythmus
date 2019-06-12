<?php


/**
 * - Create an "Add new" button
 * - Button duplictaes the current KRA data into a new dataset
 * - Display employee name and version # 
 * - Button for previous versions
 *      - Sub menu with previous verions
 * 
 */

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
                'callback'              => array( $this, 'get_kra_versions' ),
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
}

   
/**
 * Get current kra info from database
 */

$results = $wpdb->get_results( "SELECT * FROM $wp_rhythmus_kra");

if(!empty($results)) {

    echo "<table width='100%' border='0'>"; // Adding <table> and <tbody> tag outside foreach loop so that it wont create again and again
    echo "<tbody>";

    foreach($results as $row){   
        echo "<tr>";                           // Adding rows of table inside foreach loop
        echo "<th>ID</th>" . "<td>" . $row->id . "</td>";
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
        echo "<tr>";        
        echo "<th>User IP</th>" . "<td>" . $row->teammate_id . "</td>";   //fetching data from teammate_id field
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
        echo "<tr>";        
        echo "<th>Post ID</th>" . "<td>" . $row->is_current . "</td>";  //fetching data from is_current field
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
        echo "<tr>";        
        echo "<th>Time</th>" . "<td>" . $row->create_date . "</td>";    //fetching data from create_date field
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
        echo "<tr>";        
        echo "<th>Time</th>" . "<td>" . $row->last_update_date . "</td>";   //fetching data from last_update_date field
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
        echo "<tr>";        
        echo "<th>Time</th>" . "<td>" . $row->position . "</td>";   //fetching data from position field
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
        echo "<tr>";        
        echo "<th>Time</th>" . "<td>" . $row->kra . "</td>";    //fetching data from kra field
        echo "</tr>";
        echo "<td colspan='2'><hr size='1'></td>";
    }
    echo "</tbody>";
    echo "</table>"; 

}