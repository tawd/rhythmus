<?php
/**
 * Rhythmus
 *
 * @package   Rhythmus
 * @author    Josh Ahles
 * @license   GPL-3.0
 * @link      https://showit.co
 * @copyright 2019 Showit, Inc
 */

namespace Rhythmus\Endpoints;

use Rhythmus;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * @subpackage REST_Controller
 */
class Milestonia extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$milestonia_route = '/milestonia';

		$this->register_route(
			$milestonia_route,
			array(
				array(
					'methods'  => \WP_REST_Server::READABLE,
					'callback' => array( $this, 'get_milestonia' ),
					'args'     => array(),
				),
			)
		);
	}

	/**
	 * Get goal topics
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_milestonia( $request ) {

		$teammate_id = $request->get_param( 'teammate_id' );
		$users_email = $this->get_user_email( $teammate_id );
		$api_token   = $this->get_token();
		$api         = $this->get_api( $users_email, $api_token );

		// get the api data
		$api_data = $this->get_data( $api );

		// convert the api data
		$conversion = $this->convert( $api_data );

		//
		// validate token
		//
		$wp_id = $this->auth->permissions_check( $request );
		if ( ! $wp_id ) {
			return $this->endpoint_response(
				new WP_Error( 'Rhythmus_milestonia', 'invalid user ' )
			);
		}

		// lookup teammate
		$email = true;
		if ( $teammate_id ) {

		} else {

		}
		if ( ! $email ) {
			return $this->endpoint_response(
				new WP_Error( 'Rhythmus_milestonia', 'unable to find email ' )
			);
		}

		return new WP_REST_Response( $conversion, 200 );

	}

	public function get_user_email( $teammate_id ) {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT u.user_email,t.fname,t.lname
		FROM wp_users u 
		JOIN {$wpdb->prefix}rhythmus_teammate t
		ON t.wp_user_id = u.ID
		WHERE t.id = %d",
			$teammate_id
		);

		$user = $wpdb->get_row( $query );

		if ( ! $user ) {
			return '';
		}

		return $user->user_email;
	}

	public function get_api( $users_email, $token ) {

		$url = "https://app.milestonia.com/api/v1/goals?email={$users_email}&api_token={$token}";
		return $url;

	}

	public function wp_remote_get( $url, $args = array() ) {
		$http = _wp_http_get_object();
		return $http->get( $url, $args );
	}

	// get token method
	public function get_token() {

		return get_option( 'milestonia_api_key', '' );

	}

	public function get_json_string_to_arry( $api ) {

		$response = file_get_contents( $api, false );
		$data     = json_decode( $response );

		return $data;

	}

	public function get_data( $api ) {

		$remote_get = wp_remote_get( esc_url_raw( $api ) );
		return $remote_get;

	}

	public function convert( $remote_get ) {

		$conversion = json_decode( wp_remote_retrieve_body( $remote_get ), true );
		return $conversion;

	}

}
