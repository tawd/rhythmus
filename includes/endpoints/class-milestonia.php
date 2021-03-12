<?php


namespace Rhythmus\Endpoints;

use WP_REST_Request;
use WP_REST_Response;

/**
 * @subpackage REST_Controller
 */
class Milestonia extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$milestonia = '/milestonia';

		$this->register_route(
			$milestonia,
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_milestonia' ),
				'args'     => array(
					'teammate_id' => array(
						'description'       => esc_html__( 'The teammate id' ),
						'required'          => true,
						'sanitize_callback' => 'absint',
						'validate_callback' => array( $this, 'validate_int' ),
					),
				),
			),
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

		$teammate_id     = $request->get_param( 'teammate_id' );
		$cache_key       = 'rhythmus_milestonia_get_' . $teammate_id;
		$milestonia_data = wp_cache_get( $cache_key );

		if ( false === $milestonia_data ) {
			$email           = $this->get_user_email( $teammate_id );
			$token           = $this->get_token();
			$milestonia_data = $this->get_api_data( $email, $token );

			wp_cache_set( $cache_key, $milestonia_data );
		}

		return $this->endpoint_response( array( 'milestonia' => $milestonia_data ) );
	}


	/**
	 * Get user email from database using teammate ID
	 *
	 * @param int $teammate_id
	 * @return string
	 */
	public function get_user_email( $teammate_id ) {

		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT u.user_email, t.fname, t.lname FROM {$wpdb->prefix}users u
			JOIN {$wpdb->prefix}rhythmus_teammate t ON t.wp_user_id = u.ID
			WHERE t.id = %d",
			$teammate_id
		);

		$user = $wpdb->get_row( $query );
		return $user->user_email;
	}

	/**
	 * Get the secure Milestonia token
	 *
	 * @return string
	 */
	public function get_token() {
		return get_option( 'milestonia_api_key', '' );
	}

	/**
	 * Get Milestonia API data
	 *
	 * @param string $email User email.
	 * @param string $token Secure token.
	 *
	 * @return array
	 */
	public function get_api_data( $email, $token ) {

		$milestonia_url = "https://app.milestonia.com/api/v1/goals?email=$email&api_token=$token";

		$results = wp_remote_get( $milestonia_url );
		$content = wp_remote_retrieve_body( $results );

		return json_decode( $content, ARRAY_A );
	}
}
