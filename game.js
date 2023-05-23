var Game = function(positions){
	$this 		   = this;
	$this.vars 	   = { positions: positions, currentPositions: {}, markers: 0, started : false, ended : false };
	$this.defaults = { radius : 50 };
	$canvas_main = $("#canvas-main");
	$canvas = $('.canvas');
	var positions = positions;


	this.init = function(){
		$this.createCanvas();
		$this.bindMouseEvents();
	}

	this.start = function(){
		$this.vars.started = true;
		$this.vars.ended = false;
		$this.vars.accepts = 0;
		$canvas_main.find('.marker').remove();
		$this.vars.markers = 0;
		jQuery.extend( $this.vars.currentPositions, $this.vars.positions);
	}

	this.createCanvas = function(){
		$canvas_main.on('mousemove', function(e) {
			var parentOffset = $(this).parent().offset(); 
			var relX = e.pageX - parentOffset.left;
			var relY = e.pageY - parentOffset.top;

			$('.cursor').css({
				'left': relX,
				'top': relY
			});
		});

		$canvas_main.on('mouseenter', function() {
			$('.cursor').addClass('visible');
		});

		$canvas_main.on('mouseleave', function() {
			$('.cursor').removeClass('visible');
		});
	}

	this.bindMouseEvents = function() {
		$canvas_main.on('click', function(event){
			if( $this.vars.started == true && $this.vars.ended == false )
			{
				$this.addMarker(event);
			}
		});
	}

	this.addMarker = function(e){
		if( $this.vars.markers <= 6 ) {
			var parentOffset = $(e.target).parent().offset(); 
			var relX = e.pageX - parentOffset.left;
			var relY = e.pageY - parentOffset.top;

			$canvas_main.append('<div class="marker" data-x="'+relX+'" data-y="'+relY+'"></div>');

			$('.marker:last-child').css({
				'left': relX-($this.defaults.radius/2),
				'top': relY-($this.defaults.radius/2)
			});

			$this.vars.markers++;
			if( $this.vars.markers == 7) {
				$this.vars.ended = true;
				$this.verify();
			}

			return true;
		}else{
			return false;
		}
	}

	this.verify = function(){
		var distancia, $marker, markerPosition;
		
		$canvas_main.find('.marker').each(function(i){
			$marker = $(this);
			markerPosition = { x : $marker.data('x'), y : $marker.data('y') };

			$.each( $this.vars.currentPositions, function( index, position ) {
				distancia = Math.sqrt( Math.pow(markerPosition.x - position.x, 2) + Math.pow(markerPosition.y - position.y, 2) );
				if( distancia < $this.defaults.radius )
				{
					$marker.addClass('accept');
					delete $this.vars.currentPositions[index];
					$this.vars.accepts++;
				}
			});

		});

		if( $this.vars.accepts == 7 )
		{
			return true;
		}else{
			return false;
		}
	}

	this.debug = function(){
		$.each( $this.vars.positions, function( index, position ) {
			$canvas_main.append('<div class="target"></div>');
			$canvas_main.find('.target:last-child').css({
				'left': (position.x-($this.defaults.radius/2)) + 'px',
				'top': (position.y-($this.defaults.radius/2)) + 'px'
			});
		});
	}

	$this.init();
	$this.start();

	return $this;

}