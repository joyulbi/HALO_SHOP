<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SPRING BOOT</title>
<!-- Latest compiled and minified CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Latest compiled JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
	<div class="container card card-info my-3 p-3">
		<h3 class="card-header"> TEST1 - SERVICE </h3>
		<div class="alert alert-warning">${time}</div>
		
		<h3 class="card-header my-1">TEST2 - JSTL : if</h3>
		<c:if test="true">
			<div class="alert alert-warning">hi</div>
		</c:if>
		
		<h3 class="card-header my-1">TEST2 - JSTL : forEach</h3>
		<table class="table table-striped table-bordered table hover">
			<tbody>
				<tr>
					<c:forEach var="i" begin="1" end="3"><td>${i}</td></c:forEach>
				</tr>
			</tbody>
		</table>
	</div>
</body>
</html>