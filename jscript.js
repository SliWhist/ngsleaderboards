<head>
	<title>PSO2NGS Unofficial Leaderboards</title>
	<link rel="stylesheet" href="style.css">
</head>

<body>
	<div class="informational">
		This is a very barebones PSO2NGS leaderboard made by SliWhist
		<br>
		<br>It's held together by ducktape, glue, and tears.
		<br>
		<br>
		<br>Click a category to enter a horribly nested set of subcategories to see scores.
		<br>
		<br>A proper score submission method is still in progress.
		<br>
		<br>
		<br>Also, this was put together using copy-paste from W3Schools, research from various stackoverflow questions, and outright gutted parts of multiple codepen.io projects.
		<br>
		<br>Basically, it could break at any time, is a crediting nightmare, and will be redone when I'm less tired.
	</div>
	<div>
		<section id="scoreboard">
		  
			<div class="category">
				<button class="catlink" onclick="changeCategory(event, 'purple')">Purple Triggers</button>
				<button class="catlink" onclick="changeCategory(event, 'ordinal')">Ordinal Tower</button>
			<!--  <button class="tablinks" onclick="changeCategory(event, 'pyramid')">Trinitas (Pyramid)</button>
			  <button class="tablinks" onclick="changeCategory(event, 'strike')">Cannonball Strike</button>
			  <button class="tablinks" onclick="changeCategory(event, 'cocoons')">Cocoons & Towers</button>
			  <button class="tablinks" onclick="changeCategory(event, 'fieldraces')">Field Races</button> -->
			</div>
			  
			<div id="ordinal" class="category-content">
				<div class="placeholderText">
					Soon :)
				</div>
			</div>
			  
			<div id="purple" class="category-content">
			  
				<div class="subcategory">
					<button class="subcatlink" onclick="changeSubCategory(event, 'purp-ael')">Aelio Devastators (Rank 3)</button>
					<button class="subcatlink" onclick="changeSubCategory(event, 'purp-ret')">Retem Devastators (Rank 3)</button>
					<button class="subcatlink" onclick="changeSubCategory(event, 'purp-kvar')">Kvaris Devastators (Rank 2)</button>
					<button class="subcatlink" onclick="changeSubCategory(event, 'purp-stia')">Stia Devastators</button>
				</div>

				<div id="purp-ael" class="subcategory-content">
					<div class="partysize">
						<button class="partylink" onclick="changeBracket(event, 'purp-ael-1')">Solo</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-ael-2')">Duos (2 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-ael-3')">Trios (3 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-ael-4')">Full Party (4 Players)</button>
					</div>
				  
				</div>
				  
				<div id="purp-ret" class="subcategory-content">
					<div class="partysize">
						<button class="partylink" onclick="changeBracket(event, 'purp-ret-1')">Solo</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-ret-2')">Duos (2 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-ret-3')">Trios (3 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-ret-4')">Full Party (4 Players)</button>
					</div>
				</div>
				  
				<div id="purp-kvar" class="subcategory-content">
					<div class="partysize">
						<button class="partylink" onclick="changeBracket(event, 'purp-kvar-1')">Solo</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-kvar-2')">Duos (2 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-kvar-3')">Trios (3 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-kvar-4')">Full Party (4 Players)</button>
					</div>
				</div>
				   
				<div id="purp-stia" class="subcategory-content">
					<div class="partysize">
						<button class="partylink" onclick="changeBracket(event, 'purp-stia-1')">Solo</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-stia-2')">Duos (2 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-stia-3')">Trios (3 Players)</button>
						<button class="partylink" onclick="changeBracket(event, 'purp-stia-4')">Full Party (4 Players)</button>
					</div>
				</div>

				<table id="ranking" class="score-ranking" width=100%>
					<thead>
						<tr>
							<th>Rank</th>
							<th>Player</th>
							<th>Main Class</th>
							<th>Subclass</th>
							<th class="CellWithComment">Weapon(s)<span class="CellComment">These are the weapons that were in use on the run shown.</span></th>
							<th class="CellWithComment">Game Time<span class="CellComment">Displayed in MM:SS. Game Time is the final time as shown by the game.</span></th>
							<th>Score</th>
							<th>Video Link</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			  
			</div>
		</section>

	</div>
</body>

<script src="jscript.js"></script>
