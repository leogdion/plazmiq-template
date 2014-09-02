<?php
/**
 * Custom functions
 */
function explain_less_login_issues(){ return '<strong>ERROR</strong>: Entered credentials are incorrect.';}
add_filter( 'login_errors', 'explain_less_login_issues' );
