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
			'args'     => array(
				'id'      => array(
					'description'       => esc_html__( 'The ID for the KRA form' ),
					'required'          => true,
					'sanitize_callback' => 'absint',
					'validate_callback' => array( $this, 'validate_int' )
				),
				'teammate_id' => array(
					'description'       => esc_html__( 'The teammate id' ),
					'sanitize_callback' => 'absint',
					'validate_callback' => array( $this, 'validate_int' )
				),
				'is_current'  => array(
					'description' => esc_html__( 'Whether or not this revision is current' ),
				),
				'position'    => array(
					'description' => esc_html__( 'The job title for this teammate' ),
				),
				'kra'         => array(
					'description' => esc_html__( 'The teammates current responsibilities' ),
				),
			),
		) );
	}

	public function create( $request ) {

	}


	/**
	 * Get KRA topics
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function read( $request ) {
		global $wpdb;

		$id = $request->get_param( 'teammate_id' );

		$query = $wpdb->prepare(
			"SELECT k.teammate_id, k.is_current, k.create_date, k.last_update_date, k.position, k.kra, CONCAT(t.fname, ' ', t.lname) AS name
			FROM {$wpdb->prefix}rhythmus_kra k
			JOIN {$wpdb->prefix}rhythmus_teammate t ON k.teammate_id = t.id
			WHERE k.teammate_id = %d
			ORDER BY k.create_date ASC", $id
		);

		$results = $wpdb->get_results( $query, ARRAY_A );

		if ( count( $results ) === 1 ) {

			$kra                    = $this->parse_kra( $results[0] );
			$kra['revision_number'] = 0;
		} elseif ( count( $results ) > 1 && ! $request->get_param( 'revision' ) ) {
			$kra = $this->get_index( $results, 'current' );
		} elseif ( count( $results ) > 1 && $request->get_param( 'revision' ) ) {
			$kra = $this->get_index( $results, $request->get_param( 'revision' ) );
		}

		return $this->endpoint_response( $kra );

	}

	private function parse_kra( $row ) {

		$row['teammate_id'] = (int) $row['teammate_id'];
		$row['is_current']  = (int) $row['is_current'] === 1 ? true : false;
		$row['kra']         = json_decode( $row['kra'] );

		return $row;
	}

	private function get_index( array $results, $position ) {

		foreach ( $results as $index => $result ) {
			if ( $position === 'current' && $result['is_current'] ) {
				$kra                    = $this->parse_kra( $result );
				$kra['revision_number'] = $index;

				return $kra;
			} elseif ( is_int( $position ) && $position === $index ) {
				$kra                    = $this->parse_kra( $result );
				$kra['revision_number'] = $index;

				return $kra;
			}
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

		$table_name = $wpdb->prefix . 'rhythmus_kra';
		$updates = array();

		if ( ! empty( $request->get_param( 'is_current' ) ) ) {
			$updates['is_current'] = $request->get_param( 'is_current' ) === 'true' ? 1 : 0;
		}

		if ( ! empty( $request->get_param( 'position' ) ) ) {
			$updates['position'] = $request->get_param( 'position' );
		}

		if ( ! empty( $request->get_param( 'kra' ) ) ) {
			$updates['kra'] = $request->get_param( 'kra' );
		}

		$result = $wpdb->update(
			$table_name,
			$updates,
			array( 'id' => $request->get_param( 'id' ) )
		);

		if ( ! $result ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_kra_update', 'Could not update record #' . $request->get_param( 'id' ) )
			);
		}

		return $this->endpoint_response();
	}

	public function create_revision( $request ) {

	}
}
