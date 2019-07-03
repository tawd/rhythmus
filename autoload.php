<?php

/**
 * Class Autoload
 * @package Rhythmus
 */
class Rhythmus_Autoload {

	/**
	 *
	 */
	const ROOT = 'Rhythmus';

	/**
	 * A WordPress specific autoloader.
	 *
	 * This autoloader uses WordPress directory and file conventions for
	 * PHP classes in its auto loading.
	 *
	 * @param $class
	 */
	public static function wp_autoloader( $class ) {

		$prefix = self::ROOT . '\\';
		$base_dir = __DIR__ . '/includes/';
		$len = strlen( $prefix );

		if ( strncmp( $prefix, $class, $len ) !== 0 ) {
			return;
		}

		$relative_class = substr( $class, $len );
		$relative_class = str_replace( '_', '-', $relative_class );
		$relative_class = strtolower( preg_replace( '/([^\\\\]+)$/i', '$2class-$1', $relative_class ) );

		$file = $base_dir . str_replace( '\\', '/', $relative_class ) . '.php';
		if ( file_exists( $file ) ) {
			require $file;
		}
	}
}

spl_autoload_register( array( 'Rhythmus_Autoload', 'wp_autoloader' ) );
