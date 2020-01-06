<?php
  //Make sure logged in User has a key
  if(is_user_logged_in()){
    $uid = get_current_user_id();

    $apiKEY = get_user_meta($uid, 'rhythmus-key', true);
    $siteURL = get_site_url();

    if(!$apiKEY) {
        $apiKEY = uniqid();
        add_user_meta($uid, 'rhythmus-key', $apiKEY, true);
    }

    global $wpdb;

	$table_name = $wpdb->prefix . 'rhythmus_teammate';
    $my_teammate_id = $wpdb->get_var("select id from $table_name where wp_user_id=$uid");
    
    status_header( 200 );
    
    ?><!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>Showit React App</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <?php
    $CSSfiles = scandir(dirname(__FILE__) . '/app/build/static/css/');
    foreach($CSSfiles as $filename) {
        if(strpos($filename,'.css')&&!strpos($filename,'.css.map')) {
            echo '<link href="'.plugin_dir_url( __FILE__ ) . 'app/build/static/css/' . $filename.'?'.mt_rand(10,1000).'" rel="stylesheet">';
        }
    }
    ?>
    <script id="app-config" type="application/json">
    {
        "baseURL":"<?php echo $siteURL;?>",
        "apiKey":"<?php echo $apiKEY;?>",
        "my_teammate_id":"<?php echo $my_teammate_id;?>",
        "is_admin":"<?php echo is_super_admin();?>"
    }
    </script>
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script>!function (l) { function e(e) { for (var r, t, n = e[0], o = e[1], u = e[2], f = 0, i = []; f < n.length; f++)t = n[f], p[t] && i.push(p[t][0]), p[t] = 0; for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (l[r] = o[r]); for (s && s(e); i.length;)i.shift()(); return c.push.apply(c, u || []), a() } function a() { for (var e, r = 0; r < c.length; r++) { for (var t = c[r], n = !0, o = 1; o < t.length; o++) { var u = t[o]; 0 !== p[u] && (n = !1) } n && (c.splice(r--, 1), e = f(f.s = t[0])) } return e } var t = {}, p = { 1: 0 }, c = []; function f(e) { if (t[e]) return t[e].exports; var r = t[e] = { i: e, l: !1, exports: {} }; return l[e].call(r.exports, r, r.exports, f), r.l = !0, r.exports } f.m = l, f.c = t, f.d = function (e, r, t) { f.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: t }) }, f.r = function (e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, f.t = function (r, e) { if (1 & e && (r = f(r)), 8 & e) return r; if (4 & e && "object" == typeof r && r && r.__esModule) return r; var t = Object.create(null); if (f.r(t), Object.defineProperty(t, "default", { enumerable: !0, value: r }), 2 & e && "string" != typeof r) for (var n in r) f.d(t, n, function (e) { return r[e] }.bind(null, n)); return t }, f.n = function (e) { var r = e && e.__esModule ? function () { return e.default } : function () { return e }; return f.d(r, "a", r), r }, f.o = function (e, r) { return Object.prototype.hasOwnProperty.call(e, r) }, f.p = "/"; var r = window.webpackJsonp = window.webpackJsonp || [], n = r.push.bind(r); r.push = e, r = r.slice(); for (var o = 0; o < r.length; o++)e(r[o]); var s = n; a() }([])</script>
<?php
    $JSfiles = scandir(dirname(__FILE__) . '/app/build/static/js/');
    $react_js_to_load = '';
    foreach($JSfiles as $filename) {
        if(strpos($filename,'.js')&&!strpos($filename,'.js.map')) {
            echo '<script src="'.plugin_dir_url( __FILE__ ) . 'app/build/static/js/' . $filename.'?'.mt_rand(10,1000).'"></script>';
        }
    }
?>
</body>

</html>
<?php
  } else {
      wp_redirect("/login");
    //   echo "Please <a href='/login'>login</a> to continue.";
  }