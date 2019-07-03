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
				'methods'               => \WP_REST_Server::READABLE,
				'callback'              => array( $this, 'get_wr_status_list' ),
				'args'                  => array(),
			),
		) );

		$this->register_route( $route, array(
			array(
				'methods'               => \WP_REST_Server::EDITABLE,
				'callback'              => array( $this, 'update_wr_status' ),
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
	 * @return WP_Error|WP_REST_Request
	 */
	public function get_wr_status_list( $request ) {
		//Currently reading sample data from a file and returning
		$sample = json_decode(file_get_contents(__DIR__.'/sample-data/wr-status-list.json'));
		return new \WP_REST_Response( $sample, 200 );

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
	 * Validate any values that ought to be integers.
	 *
	 * @param mixed $value
	 * @param WP_REST_Request $request
	 * @param string $param
	 * @return WP_Error
	 */
	public function validate_int( $value, $request, $param ) {

		if ( ! is_int( (int) $value ) ) {
			return new WP_Error( 'rest_invalid_param', 'This value needs to be a number.' );
		}
	}

	/**
	 * Create OR Update
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function update_wr_status( $request ) {
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

		if ( $wpdb->query($sql) ) {
			$updated = true;
		} else {
			$updated = false;
		}

		// TODO: We should probably create a common response format.
		return new WP_REST_Response( array(
			'success'   => $updated
		), 200 );
	}
}
