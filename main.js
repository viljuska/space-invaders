window.addEventListener( 'load', () => {
	/**
	 * @var {HTMLCanvasElement} canvas
	 */
	const canvas  = document.getElementById( 'canvas' );
	const ctx     = canvas.getContext( '2d' );
	canvas.width  = window.innerWidth * 0.7;
	canvas.height = window.innerHeight * 0.8;

	class Player {
		/**
		 *
		 * @param x
		 * @param y
		 * @param {CanvasRenderingContext2D} ctx
		 * @param width
		 * @param height
		 */
		constructor( x, y, ctx, width, height ) {
			this.ctx        = ctx;
			this.width      = 450 * 0.4;
			this.height     = 225 * 0.4;
			this.gameWidth  = width;
			this.gameHeight = height;
			this.x          = x - this.width * 0.5;
			this.y          = y - this.height;
			this.velocityX  = 10;
			this.velocityY  = 10;
			this.rotation   = 0;
			this.velocityR  = 0.15;
			this.image      = new Image();
			this.image.src  = '/assets/icons/spaceship.png';
			this.keys       = {
				up   : false,
				right: false,
				down : false,
				left : false,
			};
		}

		update() {
			// Move up until border
			if ( this.keys.up && this.y > 0 ) {
				this.y -= this.velocityY;
			}

			// Move right until border
			if ( this.keys.right && this.x + this.width < this.gameWidth ) {
				this.x += this.velocityX;
			}

			// Move down until border
			if ( this.keys.down && this.y + this.height < this.gameHeight ) {
				this.y += this.velocityY;
			}

			// Move left until border
			if ( this.keys.left && this.x > 0 ) {
				this.x -= this.velocityX;
			}
		}

		addKeys( e ) {
			switch ( e.key ) {
				case 'ArrowUp':
				case 'w':
					this.keys.up = true;
					break;
				case 'ArrowDown':
				case 's':
					this.keys.down = true;
					break;
				case 'ArrowRight':
				case 'd':
					this.keys.right = true;
					this.rotation   = this.velocityR;
					break;
				case 'ArrowLeft':
				case 'a':
					this.keys.left = true;
					this.rotation  = -this.velocityR;
					break;
			}
		}

		removeKeys( e ) {
			switch ( e.key ) {
				case 'ArrowUp':
				case 'w':
					this.keys.up = false;
					break;
				case 'ArrowDown':
				case 's':
					this.keys.down = false;
					break;
				case 'ArrowRight':
				case 'd':
					this.keys.right = false;
					this.rotation   = 0;
					break;
				case 'ArrowLeft':
				case 'a':
					this.keys.left = false;
					this.rotation  = 0;
					break;
			}
		}

		draw() {
			this.ctx.save();

			this.ctx.translate( this.x + this.width * 0.5, this.y + this.height * 0.5 );
			this.ctx.rotate( this.rotation );
			this.ctx.translate( -this.x - this.width * 0.5, -this.y - this.height * 0.5 );

			this.ctx.fillRect( this.x, this.y, this.width, this.height );
			this.ctx.drawImage( this.image, this.x, this.y, this.width, this.height );

			this.ctx.restore();
		}
	}

	class Projectile {
		/**
		 *
		 * @param x
		 * @param y
		 * @param {CanvasRenderingContext2D} ctx
		 * @param width
		 * @param height
		 */
		constructor( x, y, ctx, width, height ) {
			this.ctx               = ctx;
			this.gameWidth         = width;
			this.gameHeight        = height;
			this.x                 = x;
			this.y                 = y;
			this.velocityX         = 1;
			this.velocityY         = 8;
			this.radius            = 5;
			this.markedForDeletion = false;
		}

		update() {
			this.y -= this.velocityY;

			if ( this.y < 0 ) {
				this.markedForDeletion = true;
			}
		}

		draw() {
			this.ctx.beginPath();
			this.ctx.arc( this.x, this.y, this.radius, 0, Math.PI * 2 );
			this.ctx.closePath();
			this.ctx.stroke();
		}
	}

	class Invader {
		static width  = 31;
		static height = 39;

		/**
		 *
		 * @param x
		 * @param y
		 * @param {CanvasRenderingContext2D} ctx
		 * @param width
		 * @param height
		 */
		constructor( x, y, ctx, width, height ) {
			this.ctx        = ctx;
			this.width      = Invader.width;
			this.height     = Invader.height;
			this.gameWidth  = width;
			this.gameHeight = height;
			this.x          = x - this.width * 0.5;
			this.y          = y - this.height;
			this.velocityX  = 10;
			this.velocityY  = 10;
			this.rotation   = 0;
			this.velocityR  = 0.15;
			this.image      = new Image();
			this.image.src  = '/assets/icons/invader.png';
		}

		update() {

		}

		draw() {
			this.ctx.fillRect( this.x, this.y, this.width, this.height );
			this.ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
		}
	}

	class Grid {
		constructor() {
			this.x         = 0;
			this.y         = 0;
			this.velocityX = 3;
			this.velocityY = 3;
			this.invaders  = [];
			this.columns   = Math.floor( Math.random() * 5 + 1 );
			this.rows      = Math.floor( Math.random() * 5 + 1 );

			this.generateInvaders();
		}

		generateInvaders() {
			for ( let i = 0; i < this.columns; i++ ) {
				for ( let j = 0; j < this.rows; j++ ) {
					this.invaders.push( new Invader( i * Invader.width, j * Invader.height, ctx, canvas.width, canvas.height ) );
				}
			}
		}

		update() {

		}
	}

	const player      = new Player( canvas.width * 0.5, canvas.height, ctx, canvas.width, canvas.height ),
	      projectiles = [],
	      grids       = [ new Grid() ];
	window.addEventListener( 'keydown', e => {
		player.addKeys( e );

		if ( e.key === ' ' ) {
			projectiles.push( new Projectile( player.x + player.width * 0.5, player.y, ctx, canvas.width, canvas.height ) );
		}
	} );
	window.addEventListener( 'keyup', e => {
		player.removeKeys( e );
	} );

	function animate() {
		ctx.clearRect( 0, 0, canvas.width, canvas.height );

		player.update();
		player.draw();


		for ( const [ index, grid ] of grids.entries() ) {
			grid.update();

			for ( const [ index, invader ] of grid.invaders.entries() ) {
				// if ( invader.markedForDeletion ) {
				// 	projectiles.splice( index, 1 );
				// 	continue;
				// }

				invader.update();
				invader.draw();
			}
		}

		for ( const [ index, projectile ] of projectiles.entries() ) {
			if ( projectile.markedForDeletion ) {
				projectiles.splice( index, 1 );
				continue;
			}

			projectile.update();
			projectile.draw();
		}

		requestAnimationFrame( animate );
	}

	animate();
} );
