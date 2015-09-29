angular.module( 'WynoApp' ).factory( 'TasteFactory', [ function() {
	// winery that this data pertains to
	this.winery_id = "";
	// hash containing the ids of the currently selected wines.
	this.selected_wines = [];
	// currently selected wine from list of selected wines
	this.current_wine = {};
	// begin current phase at 0
	this.current_phase = 0;
	this.phases = [];

	/**
	 * Adds a wine to the currently selected wines hash
	 * during a tasting session. 
	 * @param {number} wine - id of wine that user selected
	 */
	this.selectWine = function( wine_id ) {
		this.selected_wines.unshift( wine_id );
	}

	/**
	 * Removes a wine from the currently selected wines hash
	 * during a tasting session. 
	 * @param {number} wine - id of wine that user removed
	 */
	this.unselectWine = function ( wine_id ) {
		for( var i = 0; i < this.selected_wines.length; i++)
			if( this.selected_wines[i] === wine_id )
				this.selected_wines.splice( i, 1 );
	}

	/**
	 * Attempts to find a wine within the selected_wines. If
	 * the wine doesnt exist, returns false.
	 * @param {number} wine_id
	 * @return {boolean}
	 */
	this.find = function( wine_id ) {
		for( var i = 0; i < this.selected_wines.length; i++)
			if( this.selected_wines[i] === wine_id )
				return true;
		return false;
	}

	/**
	 * If the user had a tasting session at a previous
	 * winery, and then tastes at a new one, this resets
	 * the tasting session for the new winery
	 * @param {string} new_winery_id
	 */
	this.reset = function( new_winery_id ) {
		this.winery_id = new_winery_id;
		this.selected_wines = [];
	}

	/**
	 * Since this.selected_wines is just a hash of IDs,
	 * I've created this method to return the wine's data 
	 * from an ID
	 * @param {string} wine_id
	 */
	this.getWineData = function( wine_id ) {
		return Wines.findOne( wine_id );
	}

	/**
	 * When the user is done selecting wines, this funciton 
	 * takes their selected wines and creates a personiled 
	 * tasting. Modifies this.phases, which is reflected
	 * in the view.
	 */
	this.createTasting = function() {
		if( this.selected_wines.length === 0 )
			return;

		this.phases = [];
		this.current_phase = 0;

		this.phases = this.createPhasesForWineType( "champagne" );
		this.phases = this.createPhasesForWineType( "white" );
		this.phases = this.createPhasesForWineType( "rose" );
		this.phases = this.createPhasesForWineType( "red" );
		this.phases = this.createPhasesForWineType( "desert" );

		this.setCurrentWine( 0 );
	}

	/**
	 * Returns a the wine object corresponding to the phase
	 * we are currently on. Used to display the wine info
	 * while the user is tasting each wine.
	 */
	this.setCurrentWine = function() {
		this.current_wine = this.getWineData( this.selected_wines[ this.current_phase ] );
	}

	/**
	 * Creates phases from selected wines for a provided wine type
	 * @param {string} wine_type - "white" "rose" or "red"
	 */
	this.createPhasesForWineType = function( wine_type ) {
		var i, j;
		var temp_phases = [];
		// loop through the selected wines
		for( i = 0; i < this.selected_wines.length; i++ ) {
			wine = Wines.findOne( this.selected_wines[ i ] );
			// if this wine is of the wine type
			if( wine.type === wine_type ) {
				// loop through the temp phases and place wine in correct place
				for( j = 0; j < temp_phases.length; j++ ) {
					if( wine.modules.richness <= temp_phases[j].modules.richness ) {
						temp_phases.splice( j, 0, wine );
						break;
					}
				}
				// if we hit the end, it is the heaviest wine and belongs at the back
				if( j === temp_phases.length) {
					temp_phases.push( wine );
				}
			}
		} 
		// finally add temp_phases to the real phases
		return this.phases.concat( temp_phases );
	}

	return this;
}]);