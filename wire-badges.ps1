$p = "src\mission.js"
$c = Get-Content $p -Raw

# 1. After learner submits evidence
$old1 = @'
        showSubmitted(
          student,
          assignment
        );
'@

$new1 = @'
        showSubmitted(
          student,
          assignment,
          allAssignments
        );
'@

# 2. Existing submission awaiting admin review
$old2 = @'
      showSubmitted(
        student,
        submittedMission
      );
'@

$new2 = @'
      showSubmitted(
        student,
        submittedMission,
        allAssignments
      );
'@

# 3. Approved/completed Hour but no next Hour released
$old3 = @'
      showWaiting(
        student
      );

      return;


    // ==================================================
    // SHOW ONLY THE FIRST AVAILABLE HOUR
'@

$new3 = @'
      showWaiting(
        student,
        allAssignments
      );

      return;


    // ==================================================
    // SHOW ONLY THE FIRST AVAILABLE HOUR
'@

# 4. Current released mission
$old4 = @'
    showActiveMission(
      student,
      currentMission
    );
'@

$new4 = @'
    showActiveMission(
      student,
      currentMission,
      allAssignments
    );
'@


if (-not $c.Contains($old1)) {
    throw "PATCH 1 NOT FOUND"
}

if (-not $c.Contains($old2)) {
    throw "PATCH 2 NOT FOUND"
}

if (-not $c.Contains($old3)) {
    throw "PATCH 3 NOT FOUND"
}

if (-not $c.Contains($old4)) {
    throw "PATCH 4 NOT FOUND"
}


$c = $c.Replace($old1, $new1)
$c = $c.Replace($old2, $new2)
$c = $c.Replace($old3, $new3)
$c = $c.Replace($old4, $new4)

Set-Content $p $c -Encoding UTF8

Write-Host "4 BADGE DATA ROUTES WIRED SUCCESSFULLY"