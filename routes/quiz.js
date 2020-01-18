var express = require('express');
var router = express.Router();

/* GET quiz page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM quiz',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('quiz/list',{title:"quiz",data:rows});
		});
     });
});

router.post('/add', function(req, res, next) {
	req.assert('id_quiz', 'isi id_quiz').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_id_quiz = req.sanitize( 'id_quiz' ).escape().trim();
		v_quiz = req.sanitize( 'quiz' ).escape().trim(); 
		v_a = req.sanitize( 'a' ).escape().trim();
		v_b = req.sanitize( 'b' ).escape().trim();
		v_c = req.sanitize( 'c' ).escape().trim();
		v_d = req.sanitize( 'd' ).escape().trim();
		v_answer = req.sanitize( 'answer' ).escape();

		var quiz = {
			id_quiz: v_id_quiz,
			quiz: v_quiz,
			a: v_a,
			b: v_b,
            c: v_c,
            d: v_d,
			answer: v_answer
		};

		var insert_sql = 'INSERT INTO quiz SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, quiz, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('quiz/add-quiz', 
					{ 
						id_quiz: req.param('id_quiz'), 
						quiz: req.param('quiz'), 
						a: req.param('a'),
						b: req.param('b'),
						c: req.param('c'),
						d: req.param('d'),
						answer: req.param('answer')
					});
				}else{
					req.flash('msg_info', 'Sukses menambah quiz'); 
					res.redirect('/quiz');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>';
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('quiz/add-quiz', 
		{ 
			id_quiz: req.param('id_quiz'),
			quiz: req.param('quiz'), 
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'quiz/add-quiz', 
	{ 
		title: 'Tambah quiz Baru',
		id_quiz: '',
		quiz: '',
		a: '',
		b: '',
        c: '',
        d: '',
        answer: ''
	});
});

router.get('/edit/(:id_quiz)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM quiz where id_quiz='+req.params.id_quiz,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/quiz'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "quiz tidak bisa dicari!"); 
					res.redirect('/quiz');
				}
				else
				{	
					console.log(rows);
					res.render('quiz/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id_quiz)', function(req,res,next){
	req.assert('id_quiz', 'isi id_quiz').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_id_quiz = req.sanitize( 'id_quiz' ).escape().trim();
		v_quiz = req.sanitize( 'quiz' ).escape().trim(); 
		v_a = req.sanitize( 'a' ).escape();
		v_b = req.sanitize( 'b' ).escape();
		v_c = req.sanitize( 'c' ).escape();
		v_d = req.sanitize( 'd' ).escape();
		v_answer = req.sanitize( 'answer' ).escape();

		var quiz = {
			id_quiz: v_id_quiz,
			quiz: v_quiz,
			a: v_a,
			b: v_b,
            c: v_c,
            d: v_d,
			answer: v_answer
		};


		var update_sql = 'update quiz SET ? where id_quiz = '+req.params.id_quiz;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, quiz, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('quiz/edit', 
					{ 
						id_quiz: req.param('id_quiz'), 
						quiz: req.param('quiz'), 
						a: req.param('a'),
						b: req.param('b'),
						c: req.param('c'),
						d: req.param('d'),
						answer: req.param('answer')
					});
				}else{
					req.flash('msg_info', 'Sukses update quiz'); 
					res.redirect('/quiz/edit/'+req.params.id_quiz);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there was an error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('quiz/add-quiz', 
		{ 
			id_quiz: req.param('id_quiz'), 
			quiz: req.param('quiz')
		});
	}
});

router.delete('/delete/(:id_quiz)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var quiz = {
			id_quiz: req.params.id_quiz,
		}
		
		var delete_sql = 'delete from quiz where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, quiz, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/quiz');
				}
				else{
					req.flash('msg_info', 'Sukses menghapus quiz'); 
					res.redirect('/quiz');
				}
			});
		});
	});
});

module.exports = router;