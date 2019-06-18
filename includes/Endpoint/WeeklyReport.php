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
        /**
         * 1. Write a query to get some data
         * - query wp_rhythmus_weekly_report_week
         * - query wp_rhythmus_weekly_report
         * - query wp_rhythmus_teammate
         * 
         * 2. parse whatever results
         * - 
         * 
         * 3. display the data or send it to display
         */

		global $wpdb;
		// Query for our list of teammates, getting them all.
        $teammates_results = $wpdb->get_results( "SELECT id, 
													wp_user_id, 
													fname, 
													lname 
												FROM {$wpdb->prefix}rhythmus_teammate", OBJECT);

        $teammates = array();

        foreach ( $teammates_results as $result){

            $teammates[] = array(
                "name" => $result->fname." ".$result->lname,
                "userid" => intval($result->id),
				"wp_user_id" => $result->wp_user_id
            );
        }
		// Testing the data
		//return new \WP_REST_Response( $teammates, 200 );


		// Query for the actual week id that we want to see
		// We are going to pretend we are supplied a date by the front-end team.
		$date = "2019-04-20";
		$week_id = $wpdb->get_var( "SELECT id FROM {$wpdb->prefix}rhythmus_weekly_report_week WHERE '{$date}%' BETWEEN start_date AND end_date;");
		// Testing the data
		//return new \WP_REST_Response( [$date, $find_week_result], 200 );
        
		// Query for us to take the week_id from above and grab the actual week's information (start_date, end_date, etc)
		$week_data_results = $wpdb->get_results( "SELECT id, 
													start_date, 
													end_date, 
													num_submitted, 
													num_reviewed 
												FROM {$wpdb->prefix}rhythmus_weekly_report_week 
												WHERE id = {$week_id}", OBJECT );
        
		$week_data = array();

        foreach ( $week_data_results as $week ) {

            $week_data[] = array(
                "id" => intval( $week->id ),
                "start_date" => $week->start_date,
                "end_date" => $week->end_date,
                "num_submitted" => intval( $week->num_submitted ),
                "num_reviewed" => intval( $week->num_reviewed ),
            );
        }
		// Testing the data
		//return new \WP_REST_Response( $week_data, 200 );

		// Query for the actual report's information (status, reviewed, submit_date, etc) 
		// I suggest that on this one we definitely want to limit how much data we are getting back.
		// Possibly limit it to searching for a specific week, or current_week and up to X weeks back...
        $wr_results = $wpdb->get_results( "SELECT id, teammate_id, 
											week_id, 
											status, 
											reviewed, 
											submit_date 
										FROM {$wpdb->prefix}rhythmus_weekly_report 
										WHERE week_id = {$week_id}", OBJECT);

        $wr_data = array();

        foreach ( $wr_results as $wr ) {

            $wr_data[] = array( 
                "id" => intval($wr->id),
				"teammate_id" => intval($wr->teammate_id),
				"week_id" => intval($wr->week_id),
				"status" => intval($wr->status),
				"reviewed" => intval($wr->reviewed),
				"submit_date" => $wr->submit_date,
            );
        }
		// Testing the data
		return new \WP_REST_Response( $wr_data, 200 );

        //$weeks = $wpdb->get_results( "SELECT id, status, reviewed, submit_date FROM {$wpdb->prefix}wp_rhythmus_weekly_report", OBJECT);


    }

    /**
     * Create OR Update 
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_wr_status( $request ) {
        global $wpdb;
        
        // TODO: Why are we reading the contents this way and not through POST?
        $data = json_decode(file_get_contents('php://input'), true);

        // TODO: validation on incoming data
        $status = array_key_exists( 'status', $data ) ? (int) $data['status'] : 0;
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
