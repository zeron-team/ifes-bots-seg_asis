# app/moodle_integration/queries.py

# Obtiene los resultados de TODOS los que rindieron en el último año.
GET_RECENT_QUIZ_RESULTS = """
SELECT
    u.id AS userid,
    u.firstname,
    u.lastname,
    u.phone2 AS phone,
    c.fullname AS course_name,
    q.name AS quiz_name,
    qg.grade AS final_grade,
    gi.gradepass AS passing_grade
FROM
    mdl_quiz_grades qg
JOIN
    mdl_user u ON qg.userid = u.id
JOIN
    mdl_quiz q ON qg.quiz = q.id
JOIN
    mdl_course c ON q.course = c.id
JOIN
    mdl_grade_items gi ON gi.iteminstance = q.id AND gi.itemmodule = 'quiz'
WHERE
    qg.timemodified >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 365 DAY)
    AND u.phone2 IS NOT NULL AND u.phone2 != '';
"""

# Nueva consulta para alumnos que no rindieron
GET_PENDING_QUIZ_STUDENTS = """
SELECT
    u.id AS userid,
    u.firstname,
    u.lastname,
    u.phone2 AS phone,
    c.fullname AS course_name,
    q.name AS quiz_name
FROM
    mdl_enrol e
JOIN
    mdl_user_enrolments ue ON e.id = ue.enrolid
JOIN
    mdl_user u ON ue.userid = u.id
JOIN
    mdl_course c ON e.courseid = c.id
JOIN
    mdl_quiz q ON c.id = q.course
LEFT JOIN
    mdl_quiz_grades qg ON q.id = qg.quiz AND u.id = qg.userid
WHERE
    q.timeclose BETWEEN UNIX_TIMESTAMP(CURDATE() - INTERVAL 1 DAY) AND UNIX_TIMESTAMP(CURDATE())
    AND qg.id IS NULL
    AND u.phone2 IS NOT NULL AND u.phone2 != '';
"""