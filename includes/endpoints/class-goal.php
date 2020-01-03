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

class Goal extends Abstract_Endpoint {

	public function register_routes() {
		$route = '/goal';

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

		$this->register_route( '/goal-revision', array(
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
	 * Get Goal for a teammate. If no Goal exists for a user, it creates an empty Goal record and returns that as a starting point for the teammate.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function read( $request ) {
		global $wpdb;

		$teammate_id = $request->get_param( 'teammate_id' );
		$revision_num = $request->get_param( 'revision_num' );

		$rev_count_query = $wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}rhythmus_goal where teammate_id=%d", $teammate_id);
		$num_revisions = $wpdb->get_var( $rev_count_query );

		if($num_revisions == 0) {
			$current_time = date( 'Y-m-d H:i:s' );

			//TODO: Validate that the teammate_id is valid and the user has permission to insert for that teammate
			$insert_result = $wpdb->insert(
				$wpdb->prefix."rhythmus_goal",
				array(
					'teammate_id'      => $teammate_id,
                    'is_current'       => 1,
                    'mission'          => "",
					'goals'         	   => "{}",
					'create_date'      => $current_time,
					'last_update_date' => $current_time,
				)
			);
			if ( ! $insert_result ) {
				return $this->endpoint_response(
					new WP_Error( 'rhythmus_goal_revision', 'Could not insert new record for ' . $teammate_id )
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
			"SELECT g.id, g.teammate_id, g.is_current, g.create_date, g.last_update_date, g.mission, g.goals, CONCAT(t.fname, ' ', t.lname) AS name
			FROM {$wpdb->prefix}rhythmus_goal g, {$wpdb->prefix}rhythmus_teammate t 
			WHERE g.teammate_id = %d and g.teammate_id = t.id $filter_rev", $teammate_id
		);

		$row = $wpdb->get_row( $query );
		$goal = array();

		if ( $row ) {
			$goal['id']			= $row->id;
			$goal['teammate_id'] = $row->teammate_id;
			$goal['name'] 		= $row->name;
			$goal['mission'] 		= $row->mission;
			$goal['is_current']  = ($row->is_current == 1);
			$goal['goals']         = json_decode( $row->goals);
			$goal['create_date']    		= $row->create_date;
			$goal['last_update_date']    = $row->last_update_date;
			return $this->endpoint_response( $goal );
		}
		else {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_goal', 'Could not get Goal for ' . $request->get_param( 'teammate_id' ) )
			);
		}
	}

	/**
	 * Update a Goal
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
        $mission     = $data['mission'];
        $create_date = $data['create_date'];
		$last_update_date = date( 'Y-m-d H:i:s' );
		$updated = false;

		//TODO: Need to check that the teammate_id that is passed in is the current user or supervised or the current user is super admin
		//For now requiring that both are submitted and the teammate id and id of Goal line up for the update to happen
		if($id && $teammate_id) {
			$updated = $wpdb->update( 
				$wpdb->prefix . 'rhythmus_goal', 
				array( 
                    'mission' => $mission,
                    'create_date' => $create_date,
					'goals' => json_encode($data['goals']),
					'last_update_date' => date( 'Y-m-d H:i:s' )
				), 
				array( 
					'id' => $id,
					'teammate_id' => $teammate_id
				), 
				array( '%s', '%s', '%s' , '%s'), 
				array( '%d', "%d" ) 
			);
		}
		if ( ! $updated ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_goal_update', "Could not update record #$id for teammate $teammate_id" )
			);
		}

		return $this->endpoint_response();
	}

	/**
	 * Create Revision of a Goal
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function create_revision( $request ) {

		global $wpdb;
		$table_name   = $wpdb->prefix . 'rhythmus_goal';
		$current_time = date( 'Y-m-d H:i:s' );

		$teammate_id = $request->get_param( 'teammate_id' );
		$id = $request->get_param( 'id' );

		$query = $wpdb->prepare(
			"SELECT teammate_id, is_current, create_date, last_update_date, position, goal
			FROM {$wpdb->prefix}rhythmus_goal
			WHERE teammate_id = %d and id = %d and is_current = 1, $teammate_id, $id"
		);

		$results = $wpdb->get_results( $query );

		if ( count( $results ) != 1 ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_goal_revision', 'Could not find current Goal for ' . $id )
			);
		}

		$update_result = $wpdb->update(
			$table_name,
			array( 'is_current' => 0, 'last_update_date' => $current_time ),
			array( 'id' => $request->get_param( 'id' ) )
		);

		if ( ! $update_result ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_goal_revision', 'Could not update record #' . $id )
			);
		}

		$insert_result = $wpdb->insert(
			$table_name,
			array(
				'teammate_id'      => $results->teammate_id,
				'is_current'       => 1,
				'position'         => $results->position,
				'goal'              => $results->goal,
				'create_date'      => $current_time,
				'last_update_date' => $current_time,
			)
		);

		if ( ! $insert_result ) {
			return $this->endpoint_response(
				new WP_Error( 'rhythmus_goal_revision', 'Could not insert new record for ' . $id )
			);
		}

		return $this->read($request);
	}
}
