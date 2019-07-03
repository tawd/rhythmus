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
				'methods'               => WP_REST_Server::READABLE,
				'callback'              => array( $this, 'get_status_summary' ),
				'args'                  => array(),
			),
		) );

		$this->register_route( $route, array(
			array(
				'methods'               => WP_REST_Server::EDITABLE,
				'callback'              => array( $this, 'update' ),
				'permission_callback'   => array( $this->auth, 'permissions_check' ),
				/**
				 * These args are the params submitted to this endpoint.
				 * Validating and sanitizing them this way is the proper WP REST API way.
				 */
				'args'                  => array(
					'status' => array(
						'description' => esc_html__( 'The status of the weekly report' ),
						'required' => true,
						'type' => 'string',
						'enum' => array( 'complete', 'late', 'out', 'incomplete' ),
						'validate_callback' => array( $this, 'validate_status' ),
					),
					'userid' => array(
						'description' => esc_html__( 'The teammate id' ),
						'required' => true,
						'sanitize_callback' => 'absint',
						'validate_callback' => array( $this, 'validate_int' )
					),
					'week' => array(
						'description' => esc_html__( 'The week id' ),
						'required' => true,
						'sanitize_callback' => 'absint',
						'validate_callback' => array( $this, 'validate_int' )
					),
				),
			),
		) );
	}

	/**
	 * Get Weekly Report Status List
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function get_status_summary( $request ) {

		global $wpdb;

		$results = $wpdb->get_results( "SELECT w.id as week_id, w.start_date, w.end_date, w.num_submitted,
		w.num_reviewed, r.id as report_id, r.status, r.reviewed, r.submit_date,
		t.id as teammate_id, CONCAT(t.fname, ' ', t.lname) as name
		FROM {$wpdb->prefix}rhythmus_weekly_report r
		LEFT OUTER JOIN {$wpdb->prefix}rhythmus_weekly_report_week w ON w.id = r.week_id
		JOIN {$wpdb->prefix}rhythmus_teammate t ON r.teammate_id = t.id;");

		$weeks = array();
		$teammates = array();

		foreach ( $results as $result ) {

			if ( ! array_key_exists( $result->week_id, $weeks ) ) {
				$weeks[ $result->week_id ] = array(
					'id' => $result->week_id,
					'start_date' => $result->start_date,
					'end_date' => $result->end_date,
					'num_submitted' => $result->num_submitted,
					'num_reviewed' => $result->num_reviewed,
				);
			}

			if ( ! array_key_exists( $result->name, $teammates ) ) {
				$teammates[ $result->name ] = array(
					'name' => $result->name,
					'user_id' => $result->teammate_id,
					'weeks' => array(),
				);
			}

			$teammates[ $result->name ]['weeks'][ $result->week_id ] = array(
				'id' => $result->report_id,
				'status' => $result->status,
				'reviewed' => (int) $result->reviewed === 1,
				'submitted' => empty( $result->submit_date ) ? FALSE : TRUE,
			);
		}

		$response_data = array(
			'weeks' => array_values( $weeks ),
			'teammates' => array_values( $teammates ),
		);

		return $this->endpoint_response( $response_data );
	}

	/**
	 * Validate the status reported when the weekly report is updated
	 *
	 * @param mixed $value
	 * @param WP_REST_Request $request
	 * @param string $param
	 * @return WP_Error
	 */
	public function validate_status( $value, $request, $param ) {

		if ( ! is_string( $value ) ) {
			return new WP_Error( 'invalid_param', 'Invalid status.');
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
			return new WP_Error( 'rest_invalid_param', 'Invalid status.');
		}

	}

	/**
	 * Create OR Update
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function update( $request ) {
		global $wpdb;

		/**
		 * For now, simply set status to 1 if complete, 0 if anything else.
		 * TODO: This will be updated as we get more statuses
		 */
		$status = $request->get_param('status') === 'complete' ? 1 : 0;
		$teammate_id = $request->get_param('userid');
		$week_id = $request->get_param('week');

		$table_name = $wpdb->prefix . 'rhythmus_weekly_report';

		/**
		 * Insert the updated data into the database
		 * base on the id of the teammate and the id of the week.
		 */
		$sql = $wpdb->prepare( "UPDATE $table_name SET status = %d WHERE teammate_id = %d AND week_id = %d", $status, $teammate_id, $week_id );

		if ( ! $wpdb->query($sql) ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_update', 'Could not update record #' . $request->get_param( 'id' ) )
			);
		}

		return $this->endpoint_response();
	}
}
