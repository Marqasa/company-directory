<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

$name = $_REQUEST['name'];
$departmentId = $_REQUEST['departmentId'];
$locationId = $_REQUEST['locationId'];
$where = "";

if ($name || $departmentId || $locationId) {
    $where = " WHERE ";
}

if ($name) {
    $where .= "CONCAT(p.firstName, ' ', p.lastName) LIKE '%" . $name . "%' ";
}

if ($name && $departmentId) {
    $where .= " AND ";
}

if ($departmentId) {
    $where .= "d.id = " . $departmentId;
}

if ($name && $locationId || $departmentId && $locationId) {
    $where .= " AND ";
}

if ($locationId > 0) {
    $where .= "d.locationID = " . $locationId;
}

$query = '
    SELECT
        p.id,
        p.lastName,
        p.firstName,
        p.jobTitle,
        p.email,
        d.id as departmentId,
        d.name as department,
        l.id as locationId,
        l.name as location
    FROM
        personnel p
    LEFT JOIN
        department d
    ON
        (d.id = p.departmentID)
    LEFT JOIN
        location l
    ON
        (l.id = d.locationID)' . $where . '
    ORDER BY
        p.lastName,
        p.firstName,
        d.name,
        l.name
    ';

$result = $conn->query($query);

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);

    exit;
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);
echo json_encode($output);
