# app/moodle_integration/queries.py

# Obtiene los resultados de los exámenes (quizzes) del último día.
# Une las tablas de notas, usuarios, quizzes, cursos y ahora los ítems de calificación.
GET_RECENT_QUIZ_RESULTS = """
SELECT
    u.id AS userid,
    u.firstname,
    u.lastname,
    u.phone2 AS phone,
    c.fullname AS course_name,
    q.name AS quiz_name,
    qg.grade AS final_grade,
    gi.gradepass AS passing_grade -- Se obtiene de mdl_grade_items
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
    AND u.phone2 IS NOT NULL AND u.phone2 != ''
    AND qg.grade < 6;
"""