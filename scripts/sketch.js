
class q 
{ 
    constructor() 
    { 
        this.items = []; 
    } 
                  
    push(element) 
    {     
        var exists = false
        for (var i = 0; i < this.items.length; i++) {
            if (element[0] == this.items[i][0] && element[1] == this.items[i][1]) {
                exists = true
            }
        } 
        if (!exists) {
            this.items.push(element); 
        }
    } 
    pop() 
    { 
        if(this.isEmpty())  {
            return "Underflow"; 
        }
        return this.items.shift(); 
    } 
    front() 
    { 
        if(this.isEmpty()) 
            return "No elements in q"; 
        return this.items[0]; 
    } 
    isEmpty() 
    { 
        return this.items.length == 0; 
    } 
    length()
    {
        return this.items.length;
    }
} 



function dungeon()  {
    this.width = width;
    this.length = height;
    this.fillPercent = 44.5;
    this.smoothness = 5;
    this.map = [];
    this.area = [];

    this.floodFill = function(x , y, c) {
        var tiles = [];
        var queue = new q()
        queue.push([x, y]);
        this.area[x][y] = c;
        while (!queue.isEmpty()) {
            var tile = queue.pop();
            tiles.push(tile)
            for (var i = tile[0]-1; i <= tile[0]+1; i++) {
                for (var j = tile[1]-1; j <= tile[1]+1; j++) {
                    if (i >= 0 && i < this.width && j >= 0 && j < this.length) {
                        if (tile[0] == i || tile[1] == j) {
                            if (this.area[i][j] == false && (this.map[i][j] == false)) {
                                this.area[i][j] = c;
                                queue.push([i, j]);
                            }
                        }
                    }
                }
            }
        }
        return tiles;
    }
    this.findRegions = function() {
        var availableSpots = [];
        for ( var i = 0; i < this.width; i++ ) {
            availableSpots[i] = []; 
        }
        
        var amount = 0;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.length; y++) {
                if (!this.map[x][y]) {
                    availableSpots[x][y] = 0;
                    amount += 1;
                } else {
                    availableSpots[x][y] = -1;
                }
            }
        }
        var r = 1;
        while (amount > 0) {
          for (var x = 0; x < this.width; x++) {
              for (var y = 0; y < this.length; y++) {
                  if (availableSpots[x][y] == 0) {
                      var tiles = this.floodFill(x, y, r);
                      for (var i = 0; i < tiles.length; i++) {
                          availableSpots[tiles[i][0]][tiles[i][1]] = r;
                      }
                      r += 1;
                      amount -= tiles.length;
                  }
              }
          }
        }
        return availableSpots;
    }
    this.randomizeMap = function() {
        for ( var i = 0; i < this.width; i++ ) {
            this.map[i] = []; 
        }
        for (var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.length; y++) {
                this.map[x][y] = false
            }
        }
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.length; j++) {
                if (i == 0 || i == this.width -1|| j == 0|| j == this.length -1) {
                    this.map[i][j] = true;
                } else {
                    var r = Math.random() * 100;
                    this.map[i][j] = (r < this.fillPercent);
                }
            }
        }
    }
    this.getSurrounding = function(x, y) {
        var count = 0;
        for (var i = x-1; i <= x+1; i++) {
            for (var j = y-1; j <= y+1; j++) {
                if (i >= 0 && i < this.width && j >= 0 && j < this.length ) {
                    if (i!=x || j!=y) {
                        if (this.map[i][j]) {
                            count +=1;
                        }
                    }
                } else {
                    count +=1;
                }
            }
        }
        return count;
    }
    this.smoothMap = function() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.length; j++) {
                count = this.getSurrounding(i, j)
                if (count > 4) {
                    this.map[i][j] = true;
                } else if (count < 4) {
                    this.map[i][j] = false;
                }
            }
        }
    }
    this.labelRegions = function (unlabeldMap) { // 2d array from findRegions();
        var regions = [];
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.length; y++) {
                var contains = false;
                for (var i = 0; i < regions.length; i++) {
                    if (regions[i] == unlabeldMap[x][y] || unlabeldMap[x][y] == 0 || unlabeldMap[x][y] == -1) {
                        contains = true;
                    }
                }
                if (!contains) {
                    regions.push(unlabeldMap[x][y]);
                }
            }
        }
        return regions;
    }
    this.getRegionSizes = function(labeldMap, regionList) { //2d arrays from findRegions() and labelRegions(findRegions())
        var regionSizes = [];
        for (var i = 0; i < regionList.length; i++) {
            var size = 0;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.length; y++) {
                    if (labeldMap[x][y] == regionList[i]) {
                        size += 1;
                    }
                }
            }
            regionSizes.push(size)
        }
        return regionSizes;
    }
    this.getIndexOfHighestSize = function(regionList, regionsSizeList) { //regionList from labelRegions() and regionSizes from getRegionSizes()
        console.log(regionList)
        var highestSize = 0;
        var indexOfHighestSize = 0;
        for (var i = 0; i < regionList.length; i++) {
            if (regionList[i] != -1) {
                if (highestSize < regionsSizeList[i]) {
                    highestSize = regionsSizeList[i];
                    indexOfHighestSize = i;
                }
            }
        }
        return indexOfHighestSize;
    }
    this.cleanMap = function (tempMap, regionList, highest) {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.length; y++) {
                if (tempMap[x][y] != regionList[highest] && tempMap[x][y] != -1) { 
                    tempMap[x][y] = -1;
                }
            }
        }
        this.map = tempMap
    }
    this.generateMap = function() {
        this.randomizeMap();
        for (var i = 0; i < this.smoothness; i++) {
            this.smoothMap();
        }

        //INITIALIZE this.area, CHANGE WHEN CONVERTING TO JAVA!
        for ( var i = 0; i < this.width; i++ ) {                        
            this.area[i] = [];                             
        }                                                             
        for (var x = 0; x < this.width; x++) {                        
            for(var y = 0; y < this.length; y++) {                        
                this.area[x][y] = false                        
            }                                     
        }

        var regions = this.findRegions();
        var labeldRegions = this.labelRegions(regions);
        var regionSizes = this.getRegionSizes(regions, labeldRegions);
        var indexOfHighestSize = this.getIndexOfHighestSize(labeldRegions, regionSizes);
        this.cleanMap(regions, labeldRegions, indexOfHighestSize);
    }
}
var d;
function setup()
{
    createCanvas(600, 600)
    d = new dungeon()
    d.generateMap();
    for (var x = 0; x < d.width; x++) {
        for (var y = 0; y < d.length; y++) {
            if (d.map[x][y] == -1) {
                fill(0)
                stroke(0)
            } else {
                fill(255)
                stroke(255)
            }
            point(x, y)
        }
    }
}
function draw()
{
   
}
