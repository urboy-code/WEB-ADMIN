var express = require('express');
var router = express.Router();

/* GET soal page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM soal',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('soal/list',{title:"soal",data:rows});
		});
     });
});

router.post('/add', function(req, res, next) {
	req.assert('id_soal', 'isi id_soal').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_id_soal = req.sanitize( 'id_soal' ).escape().trim();
		v_soal = req.sanitize( 'soal' ).escape().trim(); 
		v_optiona = req.sanitize( 'optiona' ).escape();
		v_optionb = req.sanitize( 'optionb' ).escape();
		v_optionc = req.sanitize( 'optionc' ).escape();
		v_optiond = req.sanitize( 'optiond' ).escape();
		v_answer = req.sanitize( 'answer' ).escape();

		var soal = {
			id_soal: v_id_soal,
			soal: v_soal,
			optiona: v_optiona,
			optionb: v_optionb,
            optionc: v_optionc,
            optiond: v_optiond,
			answer: v_answer
		};

		var insert_sql = 'INSERT INTO soal SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, soal, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('soal/add-soal', 
					{ 
						id_soal: req.param('id_soal'), 
						soal: req.param('soal'), 
						optiona: req.param('optiona'),
						optionb: req.param('optionb'),
						optionc: req.param('optionc'),
						optiond: req.param('optiond'),
						answer: req.param('answer')
					});
				}else{
					req.flash('msg_info', 'Sukses menambah soal'); 
					res.redirect('/soal');
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
		res.render('soal/add-soal', 
		{ 
			id_soal: req.param('id_soal'),
			soal: req.param('soal'), 
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'soal/add-soal', 
	{ 
		title: 'Tambah soal Baru',
		id_soal: '',
		soal: '',
		optiona: '',
		optionb: '',
        optionc: '',
        optiond: '',
        answer: ''
	});
});

router.get('/edit/(:id_soal)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM soal where id_soal='+req.params.id_soal,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/soal'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "soal tidak bisa dicari!"); 
					res.redirect('/soal');
				}
				else
				{	
					console.log(rows);
					res.render('soal/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id_soal)', function(req,res,next){
	req.assert('id_soal', 'isi id_soal').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_id_soal = req.sanitize( 'id_soal' ).escape().trim(); 
		v_soal = req.sanitize( 'soal' ).escape().trim(); 
		v_optiona = req.sanitize( 'optiona' ).escape().trim();
		v_optionb = req.sanitize( 'optionb' ).escape().trim();
        v_optionc = req.sanitize( 'optionc' ).escape().trim();
		v_optiond = req.sanitize( 'optiond' ).escape().trim();
        v_answer = req.sanitize( 'answer' ).escape().trim();

		var soal = {
			id_soal: v_id_soal,
			soal: v_soal,
			optiona: v_optiona,
			optionb: v_optionb,
            optionc: v_optionc,
            optiond: v_optiond,
            answer: v_answer
		}

		var update_sql = 'update soal SET ? where id_soal = '+req.params.id_soal;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, soal, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('soal/edit', 
					{ 
						id_soal: req.param('id_soal'), 
						soal: req.param('soal'),
						optiona: req.param('optiona'),
						optionb: req.param('optionb'),
						answer: req.param('answer'),
					});
				}else{
					req.flash('msg_info', 'Sukses update soal'); 
					res.redirect('/soal/edit/'+req.params.id_soal);
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
		res.render('soal/add-soal', 
		{ 
			id_soal: req.param('id_soal'), 
			soal: req.param('soal')
		});
	}
});

router.delete('/delete/(:id_soal)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var soal = {
			id_soal: req.params.id_soal,
		}
		
		var delete_sql = 'delete from soal where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, soal, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/soal');
				}
				else{
					req.flash('msg_info', 'Sukses menghapus soal'); 
					res.redirect('/soal');
				}
			});
		});
	});
});

module.exports = router;