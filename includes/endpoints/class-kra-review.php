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
class KRA_Review extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$kra_review_route = '/kra-review';

		$this->register_route( $kra_review_route, array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'read' ),
				'args'     => array(),
			),
		) );

		$this->register_route( $kra_review_route, array(
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'update' ),
				'args'     => array(),
			),
		) );
	}

	/**
	 * Get a KRA review
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function read( $request ) {
		global $wpdb;

		$teammate_id = $request->get_param( 'teammate_id' );

		$sql = $wpdb->prepare( "SELECT rt.id, fname, lname, year, month, total, submitted, reviewed, topics, 
        review_notes, submit_date, rkr.last_update_date, rk.position, rk.kra 
        FROM {$wpdb->prefix}rhythmus_teammate rt LEFT OUTER JOIN {$wpdb->prefix}rhythmus_kra_review rkr on rt.id = rkr.teammate_id 
		LEFT OUTER JOIN {$wpdb->prefix}rhythmus_kra rk on rt.id = rk.teammate_id and rk.is_current = 1 
        WHERE rt.id = %d and is_active = 1 ORDER BY year DESC, month DESC", $teammate_id );

		$results = $wpdb->get_results( $sql );

		$teammate = array();
		$months   = array();

		foreach ( $results as $row ) {
			if ( ! $teammate['userid'] ) {
				$teammate['userid'] = $row->id;
				$teammate['name']   = $row->fname . ' ' . $row->lname;
				$teammate['position'] = $row->position;
				$teammate['kra'] = json_decode( $row->kra);
			}
			$key            = $row->year . '-' . $row->month;
			$months[ $key ] = array(
				'total'        => $row->total,
				'reviewed'     => $row->reviewed == 1 ,
				'submitted'    => $row->submitted == 1,
				'review_notes' => $row->review_notes,
				'create-date'  => $row->create_date,
				'last-update'  => $row->last_update_date,
				'submit-date'  => $row->submit_date,
				'topics'       => json_decode( $row->topics, false ),
			);
		}
		$teammate['months'] = $months;

		return $this->endpoint_response( $teammate );
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
		$table_name = $wpdb->prefix . 'rhythmus_kra_review';

		$submit_date = gmdate('H:i:s', $data['submit_date']);
		
		//TODO: Need to check that the teammate_id that is passed in is the current user or supervised or the current user is super admin
		$sql = $wpdb->prepare( "REPLACE INTO $table_name
				(teammate_id, year, month, total, reviewed, review_notes, topics, submitted, submit_date, last_update_date)
				VALUES
				(%d, %d, %d, %f, %d, %s, %s, %d, %s, now() )",
				$data['userid'], $data['year'], $data['month'], $data['total'],
				$data['reviewed'], $data['review_notes'], json_encode( $data['topics']), $data['submitted'], $submit_date
			);
		if ( ! $wpdb->query( $sql ) ) {
			return $this->endpoint_response( new WP_Error( 'kra_review_update', 'Could not replace the record for ' . $data['userid'] ) );
		}
		
		return $this->endpoint_response();
	}
	
}
