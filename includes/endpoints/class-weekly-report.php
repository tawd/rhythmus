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

namespace Rhythmus\Endpoints;

use Rhythmus;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * @subpackage REST_Controller
 */
class Weekly_Report extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$route = '/wr-status-list';

		$this->register_route( $route, array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_status_summary' ),
				'args'     => array(),
			),
		) );

		$route = '/wr-generate-weeks';

		$this->register_route( $route, array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'generateWeeks' ),
				'args'     => array(),
			),
		) );

		$route = '/wr-status';

		$this->register_route( $route, array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update' ),
				'permission_callback' => array(
					$this->auth,
					'permissions_check'
				),
				'args'                => array(),
			),
		) );
	}

	public function generateWeeks( $request ){
		$result ="";
		global $wpdb;
		$currYear = date("Y");
        $hasCurrYear = get_option("wr-generate-weeks-".$currYear);

		if(!$hasCurrYear){
			$currDate = strtotime("first thursday of january $currYear");
			
			while(date("Y", $currDate) == $currYear) {
				$startDate = strtotime("-6 day", $currDate);
				$current_week = array(
					'start_date'   => date('Y-m-d', $startDate),
					'end_date'     => date('Y-m-d', $currDate)
				);
				
				$wpdb->insert($wpdb->prefix."rhythmus_weekly_report_week", $current_week);
				$result.="Inserted ".date('Y-m-d',$currDate)."\n";
				$currDate = strtotime("+7 day", $currDate);
			}
			add_option( "wr-generate-weeks-".$currYear, "true" );
		} else {
			$result = "Current year already generated";
		}
		$response_data = array(
			'result'     =>  $result ,
		);
		return $this->endpoint_response( $response_data );
	}

	/**
	 * Get Weekly Report Status List
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_status_summary( $request ) {

		//TODO: No paging yet but may want to page by year or month
		global $wpdb;

		$results = $wpdb->get_results( "SELECT w.id as week_id, w.start_date, w.end_date, w.num_submitted,
		w.num_reviewed from {$wpdb->prefix}rhythmus_weekly_report_week w 
		order by end_date asc" );

		$weeks     = array();
		foreach ( $results as $result ) {
			$weeks[ $result->week_id ] = array(
				'week_id'       => $result->week_id,
				'start_date'    => $result->start_date,
				'end_date'      => $result->end_date,
				'num_submitted' => $result->num_submitted,
				'num_reviewed'  => $result->num_reviewed,
			);
		}

		$results = $wpdb->get_results( "SELECT t.id as teammate_id, r.week_id, r.status, r.reviewed, r.submit_date,
		CONCAT(t.fname, ' ', t.lname) as name
		FROM {$wpdb->prefix}rhythmus_teammate t
		LEFT OUTER JOIN {$wpdb->prefix}rhythmus_weekly_report r ON t.id = r.teammate_id
		where t.is_active = 1 
		order by t.fname asc, t.lname asc, t.id asc" );	
		
		//die($wpdb->last_query);
		$teammates = array();
		$currTeammateID = 0;
		$currTeammate = null;

		foreach ( $results as $result ) {

			if($result->teammate_id != $currTeammateID){
				
				if($currTeammateID){
					array_push($teammates, $currTeammate);
				}
				$currTeammateID = $result->teammate_id;
				$currTeammate = array();
				$currTeammate["teammate_id"] = $result->teammate_id;
				$currTeammate["name"] = $result->name;
				$currTeammate["weeks"] = array();
			}

			if ( $result->week_id ) {
				$week = array(
					'status' => $result->status,
					// 'submit_date' => $result->submit_date,
					// 'reviewed'  => (int) $result->reviewed === 1,
					// 'submitted' => empty( $result->submit_date ) ? false : true,
				);
				$currTeammate["weeks"][$result->week_id] = $week;
			}

		}
		if($currTeammateID){
			array_push($teammates, $currTeammate);
		}

		$response_data = array(
			'weeks'     => array_values( $weeks ),
			'teammates' => array_values( $teammates ),
		);

		return $this->endpoint_response( $response_data );
	}

	/**
	 * Validate the status reported when the weekly report is updated
	 *
	 * @param mixed           $value
	 * @param WP_REST_Request $request
	 * @param string          $param
	 *
	 * @return WP_Error
	 */
	public function validate_status( $value, $request, $param ) {

		if ( ! is_string( $value ) ) {
			return new WP_Error( 'invalid_param', 'Invalid status.' );
		}

		/**
		 * Only the following statuses will be allowed (from the args settings):
		 * - complete
		 * - late
		 * - out
		 * - incomplete
		 */
		$attributes = $request->get_attributes();

		if ( ! in_array( $value, $attributes['args'][ $param ]['enum'], true ) ) {
			return new WP_Error( 'rest_invalid_param', 'Invalid status.' );
		}

	}

	/**
	 * Create OR Update
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function update( $request ) {
		global $wpdb;

		$data = json_decode( file_get_contents( 'php://input' ), true );

		$status      = $data['status' ];
		$teammate_id = $data[ 'teammate_id' ];
		$week_id     = $data[ 'week_id' ];

		$table_name = $wpdb->prefix . 'rhythmus_weekly_report';

		//TODO: Validate that the teammate ID is valid and user has permission along with the week chosen
		$sql = $wpdb->prepare("select * from $table_name where teammate_id=%d and week_id=%d", $teammate_id, $week_id);
		$row = $wpdb->get_row($sql);

		if(!$row){
			$result = $wpdb->insert($table_name, 
				array("teammate_id"=>$teammate_id, "week_id"=>$week_id, "status"=>$status));
		}
		else {
			$sql = $wpdb->prepare( "Update $table_name SET status = %d WHERE teammate_id = %d AND week_id = %d", 
				$status, $teammate_id, $week_id );
			$result = $wpdb->query( $sql );
		}	
		if ( ! $result ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_update', 'Could not update record #' . $week_id )
			);
		}

		return $this->endpoint_response();
	}
}
