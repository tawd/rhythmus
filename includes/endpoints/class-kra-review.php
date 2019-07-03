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
		$kra_topics_route = '/kra-topics';

		$this->register_route( $kra_review_route, array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_kra_review' ),
				'args'     => array(),
			),
		) );

		$this->register_route( $kra_review_route, array(
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'update_kra_review' ),
				'args'     => array(),
			),
		) );

		$this->register_route( $kra_topics_route, array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_kra_topics' ),
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
	public function get_kra_review( $request ) {
		global $wpdb;

		$teammate_id = $request->get_param( 'teammate_id' );

		$sql = $wpdb->prepare( "SELECT rt.id, fname, lname, year, month, total, submitted, reviewed, topics, 
        review_notes, submit_date, last_update_date 
        FROM {$wpdb->prefix}rhythmus_teammate rt LEFT OUTER JOIN {$wpdb->prefix}rhythmus_kra_review rkr on rt.id = rkr.teammate_id 
        WHERE rt.id = %d ORDER BY year DESC, month DESC", $teammate_id );

		$results = $wpdb->get_results( $sql, OBJECT );


		$teammate = array(
			'app'     => 'Rhythmus',
			'version' => 1
		);
		$months   = array();

		foreach ( $results as $row ) {
			if ( ! $teammate['userid'] ) {
				$teammate['userid'] = $row->id;
				$teammate['name']   = $row->fname . ' ' . $row->lname;
			}
			$key            = $row->year . '-' . $row->month;
			$months[ $key ] = array(
				'score'        => $row->total,
				'reviewed'     => $row->reviewed === 1,
				'submitted'    => $row->submitted === 1,
				'review_notes' => $row->review_notes,
				'create-date'  => $row->create_date,
				'last-update'  => $row->last_update_date,
				'submit-date'  => $row->submit_date,
				'topics'       => json_decode( $row->topics, false ),
			);
		}
		$teammate['months'] = $months;

		return new WP_REST_Response( $teammate, 200 );
	}

	/**
	 * Get KRA topics
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_kra_topics( $request ) {
		global $wpdb;

		$results = $wpdb->get_results( "SELECT id, name, title, description, type, source 
        FROM {$wpdb->prefix}rhythmus_kra_topic", OBJECT );

		$topics = array();

		foreach ( $results as $row ) {
			$type = '';
			if ( $row->type === 1 ) {
				$type = 'slider';
			} elseif ( $row->type === 0 ) {
				$type = 'outof';
			}
			$topic = array(
				'name'        => $row->name,
				'title'       => $row->title,
				'type'        => $type,
				'description' => $row->description
			);
			if ( $row->source === 1 ) {
				$topic['source'] = 'kra-titles';
			}

			$topics[] = $topic;
		}

		return new WP_REST_Response( array( 'topics' => $topics ), 200 );
	}

	/**
	 * Create OR Update
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Request
	 */
	public function update_kra_review( $request ) {
		global $wpdb;
		$data = json_decode( file_get_contents( 'php://input' ), true );

		$table_name = $wpdb->prefix . 'rhythmus_kra_review';

		//TODO: Need to check that the teammate_id that is passed in is the current user or supervised or the current user is super admin
		$sql = $wpdb->prepare( "REPLACE INTO $table_name
                (teammate_id, year, month, total, reviewed, review_notes, topics, last_update_date)
                VALUES
                (%d, %d, %d, %d, %d, %s, %s, now())",
			$data['userid'], $data['year'], $data['month'], $data['total'],
			$data['reviewed'], $data['review_notes'], json_encode( $data['topics'] )
		);

		$updated = false;
		if ( $wpdb->query( $sql ) ) {
			$updated = true;
		}

		return new WP_REST_Response( array(
			'success' => $updated
		), 200 );
	}
}
