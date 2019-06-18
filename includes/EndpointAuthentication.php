<?php

namespace Rhythmus;

class EndpointAuthentication {

    /**
     * Check if a given request has access
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function permissions_check( $request ) {

        if ( RHYTHMUS_ENV === 'development' ) {
            return true;
        }

        $key = base64_decode( $_GET['k'] );
        if ( $key && strpos( $key, ":" ) > 0 ) {
            $keyParts = explode(":", $key);
            if ( $keyParts[1] == get_user_meta( $keyParts[0], 'rhythmus-key', true ) ) {
                return true;
            }
        }
        return false;
    }
}