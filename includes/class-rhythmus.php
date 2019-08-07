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
namespace Rhythmus;
/**
 * @subpackage Rhythmus
 */
class Rhythmus {
	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance;
	/**
	 * The variable name is used as the text domain when internationalizing strings
	 * of text. Its value should match the Text Domain file header in the main
	 * plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'rhythmus';
	/**
	 * @var string $plugin_version
	 */
<<<<<<< HEAD:includes/class-rhythmus.php
	protected $plugin_version = '1.0.0';

=======
	protected static $instance = null;
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e:includes/Rhythmus.php
	/**
	 * Setup instance attributes
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
	}
	/**
<<<<<<< HEAD:includes/class-rhythmus.php
=======
	 * Return the plugin slug.
	 *
	 * @since    1.0.0
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}
	/**
	 * Return the plugin version.
	 *
	 * @since    1.0.0
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_version() {
		return $this->plugin_version;
	}
	/**
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e:includes/Rhythmus.php
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		include_once __DIR__ . '/class-rhythmus-install.php';
		Rhythmus_Install::rhythmus_install();
<<<<<<< HEAD:includes/class-rhythmus.php
	}

=======
    }
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e:includes/Rhythmus.php
	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
	}
<<<<<<< HEAD:includes/class-rhythmus.php

=======
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e:includes/Rhythmus.php
	/**
	 * Return an instance of this class.
	 *
	 * @return    $this    A single instance of this class.
	 * @since     1.0.0
	 *
	 */
	public static function get_instance() {
		// If the single instance hasn't been set, set it now.
		if ( null === self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}
<<<<<<< HEAD:includes/class-rhythmus.php

	/**
	 * Return the plugin slug.
	 *
	 * @return    string slug variable.
	 * @since    1.0.0
	 *
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}

	/**
	 * Return the plugin version.
	 *
	 * @return    string slug variable.
	 * @since    1.0.0
	 *
	 */
	public function get_plugin_version() {
		return $this->plugin_version;
	}

	public function initialize() {

		( new Endpoints\Teammate() )->do_hooks();
		( new Endpoints\Weekly_Report() )->do_hooks();
		( new Endpoints\KRA_Review() )->do_hooks();
		( new Endpoints\KRA_Topics() )->do_hooks();
		( new Endpoints\KRA() )->do_hooks();
	}
}
=======
}
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e:includes/Rhythmus.php
