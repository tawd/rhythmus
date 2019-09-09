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

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class KRA extends Abstract_Endpoint {

	public function register_routes() {
		$route = '/kra';

		$this->register_route( $route, array(
			'methods'  => WP_REST_Server::READABLE,
			'callback' => array( $this, 'read' ),
			'args'     => array(
				'teammate_id' => array(
					'description'       => esc_html__( 'The teammate id' ),
					'required'          => true,
					'sanitize_callback' => 'absint',
					'validate_callback' => array( $this, 'validate_int' )
				),
				'revision'    => array(
					'description'       => esc_html__( 'The revision number' ),
					'sanitize_callback' => 'absint',
					'validate_callback' => array( $this, 'validate_int' )
				),
			),
		) );

		$this->register_route( $route, array(
			'methods'  => WP_REST_Server::EDITABLE,
			'callback' => array( $this, 'update' ),
			'args'     => array()
		) );

		$this->register_route( '/kra-revision', array(
			'methods'  => WP_REST_Server::EDITABLE,
			'callback' => array( $this, 'create_revision' ),
			'args'     => array(
				'teammate_id' => array(
					'description'       => esc_html__( 'The teammate id' ),
					'required'          => true,
					'sanitize_callback' => 'absint',
					'validate_callback' => array( $this, 'validate_int' )
				)
			)
		)	);

	}

	/**
	 * Get KRA for a teammate. If no KRA exists for a user, it creates an empty KRA record and returns that as a starting point for the teammate.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function read( $request ) {
		global $wpdb;

		$teammate_id = $request->get_param( 'teammate_id' );
		$revision_num = $request->get_param( 'revision_num' );

		$rev_count_query = $wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}rhythmus_kra where teammate_id=%d", $teammate_id);
		$num_revisions = $wpdb->get_var( $rev_count_query );

		if($num_revisions == 0) {
			$current_time = date( 'Y-m-d H:i:s' );

			//TODO: Validate that the teammate_id is valid and the user has permission to insert for that teammate
			$insert_result = $wpdb->insert(
				$wpdb->prefix."rhythmus_kra",
				array(
					'teammate_id'      => $teammate_id,
					'is_current'       => 1,
					'position'         => "",
					'kra'         	   => "{}",
					'create_date'      => $current_time,
					'last_update_date' => $current_time,
				)
			);
			if ( ! $insert_result ) {
				return $this->endpoint_response(
					new WP_Error( 'rhythmus_kra_revision', 'Could not insert new record for ' . $teammate_id )
				);
			}
			$num_revisions = 1;
		}

		//Get the latest, aka the total count of revisions, unless specified revision number in request
		$filter_rev = " and is_current = 1";
		if( $revision_num && $revision_num < $rev_count_query ) {
			$filter_rev = " order_by k.id asc limit $revision_num, 1";
		}
		else {
			$revision_num = $num_revisions;
		}

		$query = $wpdb->prepare(
			"SELECT k.id, k.teammate_id, k.is_current, k.create_date, k.last_update_date, k.position, k.kra, CONCAT(t.fname, ' ', t.lname) AS name
			FROM {$wpdb->prefix}rhythmus_kra k, {$wpdb->prefix}rhythmus_teammate t 
			WHERE k.teammate_id = %d and k.teammate_id = t.id $filter_rev", $teammate_id
		);

		$row = $wpdb->get_row( $query );
		$kra = array();

		if ( $row ) {
			$kra['id']			= $row->id;
			$kra['teammate_id'] = $row->teammate_id;
			$kra['name'] 		= $row->name;
			$kra['is_current']  = ($row->is_current == 1);
			$kra['kra']         = json_decode( $row->kra);
			$kra['position']    = $row->position;
			$kra['revision']    = $revision_num;
			$kra['create_date']    		= $row->create_date;
			$kra['last_update_date']    = $row->last_update_date;
			return $this->endpoint_response( $kra );
		}
		else {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra', 'Could not get KRA for ' . $request->get_param( 'teammate_id' ) )
			);
		}
	}

	/**
	 * Update a KRA
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function update( $request ) {
		global $wpdb;

		$data = json_decode( file_get_contents( 'php://input' ), true );

		$id 		 = $data['id'];
		$teammate_id = $data['teammate_id'];
		$last_update_date = date( 'Y-m-d H:i:s' );
		$updated = false;

		//TODO: Need to check that the teammate_id that is passed in is the current user or supervised or the current user is super admin
		//For now requiring that both are submitted and the teammate id and id of KRA line up for the update to happen
		if($id && $teammate_id) {
			$updated = $wpdb->update( 
				$wpdb->prefix . 'rhythmus_kra', 
				array( 
					'position' => $data['position'], 
					'kra' => json_encode($data['kra']),
					'last_update_date' => date( 'Y-m-d H:i:s' )
				), 
				array( 
					'id' => $id,
					'teammate_id' => $teammate_id
				), 
				array( '%s', '%s', '%s' ), 
				array( '%d', "%d" ) 
			);
		}
		if ( ! $updated ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_update', "Could not update record #$id for teammate $teammate_id" )
			);
		}

		return $this->endpoint_response();
	}

	/**
	 * Create Revision of a KRA
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function create_revision( $request ) {

		global $wpdb;
		$table_name   = $wpdb->prefix . 'rhythmus_kra';
		$current_time = date( 'Y-m-d H:i:s' );

		$teammate_id = $request->get_param( 'teammate_id' );
		$id = $request->get_param( 'id' );

		$query = $wpdb->prepare(
			"SELECT teammate_id, is_current, create_date, last_update_date, position, kra
			FROM {$wpdb->prefix}rhythmus_kra
			WHERE teammate_id = %d and id = %d and is_current = 1, $teammate_id, $id"
		);

		$results = $wpdb->get_results( $query );

		if ( count( $results ) != 1 ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_revision', 'Could not find current KRA for ' . $id )
			);
		}

		$update_result = $wpdb->update(
			$table_name,
			array( 'is_current' => 0, 'last_update_date' => $current_time ),
			array( 'id' => $request->get_param( 'id' ) )
		);

		if ( ! $update_result ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_revision', 'Could not update record #' . $id )
			);
		}

		$insert_result = $wpdb->insert(
			$table_name,
			array(
				'teammate_id'      => $results->teammate_id,
				'is_current'       => 1,
				'position'         => $results->position,
				'kra'              => $results->kra,
				'create_date'      => $current_time,
				'last_update_date' => $current_time,
			)
		);

		if ( ! $insert_result ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_revision', 'Could not insert new record for ' . $id )
			);
		}

		return $this->read($request);
	}
}
