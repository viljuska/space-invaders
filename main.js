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
			this.scale      = 0.25;
			this.width      = 450 * this.scale;
			this.height     = 225 * this.scale;
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
			this.interval          = 50;
		}

		update() {
			this.y -= this.velocityY;

			if ( this.y < 0 ) {
				this.markedForDeletion = true;
			}
		}

		draw() {
			this.ctx.save();
			this.ctx.fillStyle = '#f00';
			this.ctx.beginPath();
			this.ctx.arc( this.x, this.y, this.radius, 0, Math.PI * 2 );
			this.ctx.fill();
			this.ctx.restore();
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
		 */
		constructor( x, y, ctx ) {
			this.ctx               = ctx;
			this.width             = Invader.width;
			this.height            = Invader.height;
			this.x                 = x;
			this.y                 = y;
			this.image             = new Image();
			this.image.src         = '/assets/icons/invader.png';
			this.markedForDeletion = false;
		}

		update( velocityX, velocityY ) {
			this.x += velocityX;
			this.y += velocityY;
		}

		draw() {
			this.ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
		}
	}

	class Grid {
		constructor() {
			this.x         = 0;
			this.y         = 0;
			this.velocityX = 2;
			this.velocityY = 0;
			this.invaders  = [];
			this.columns   = Math.floor( Math.random() * 12 + 5 );
			this.rows      = Math.floor( Math.random() * 5 + 3 );
			this.width     = this.columns * Invader.width;

			this.generateInvaders();
		}

		generateInvaders() {
			for ( let i = 0; i < this.columns; i++ ) {
				for ( let j = 0; j < this.rows; j++ ) {
					this.invaders.push( new Invader( i * Invader.width, j * Invader.height, ctx ) );
				}
			}
		}

		update() {
			this.x += this.velocityX;
			this.velocityY = 0;

			if ( this.x + this.width > canvas.width ) {
				this.velocityX *= -1;
				this.velocityY = Invader.height * 0.5;
			}

			if ( this.x < 0 ) {
				this.velocityX *= -1;
				this.velocityY = Invader.height * 0.5;
			}
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

		for ( const [ i, grid ] of grids.entries() ) {
			grid.update();

			Invaders:
				for ( const [ j, invader ] of grid.invaders.entries() ) {
					for ( const [ k, projectile ] of projectiles.entries() ) {
						// Remove invader and projectile when they collide
						if ( projectile.x >= invader.x && projectile.x <= invader.x + Invader.width && projectile.y <= invader.y + Invader.height && projectile.y >= invader.y ) {
							projectiles.splice( k, 1 );
							grid.invaders.splice( j, 1 );

							// Re-calculate width of the grid
							if ( grid.invaders.length ) {
								const first_invader = grid.invaders[ 0 ],
								      last_invader  = grid.invaders[ grid.invaders.length - 1 ];

								grid.width = last_invader.x + Invader.width - first_invader.x;
							}

							continue Invaders;
						}
					}

					invader.update( grid.velocityX, grid.velocityY );
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
