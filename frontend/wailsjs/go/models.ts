export namespace app {
	
	export class ProcessingResult {
	    projectId: number;
	    colors: db.ProjectColorWithMatches[];
	
	    static createFrom(source: any = {}) {
	        return new ProcessingResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.projectId = source["projectId"];
	        this.colors = this.convertValues(source["colors"], db.ProjectColorWithMatches);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace appkit {
	
	export class RangeFilter {
	    min?: number;
	    max?: number;
	
	    static createFrom(source: any = {}) {
	        return new RangeFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.min = source["min"];
	        this.max = source["max"];
	    }
	}
	export class SortColumn {
	    column: string;
	    direction: string;
	
	    static createFrom(source: any = {}) {
	        return new SortColumn(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.column = source["column"];
	        this.direction = source["direction"];
	    }
	}
	export class ViewSort {
	    primary: SortColumn;
	    secondary: SortColumn;
	    tertiary: SortColumn;
	    quaternary: SortColumn;
	
	    static createFrom(source: any = {}) {
	        return new ViewSort(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.primary = this.convertValues(source["primary"], SortColumn);
	        this.secondary = this.convertValues(source["secondary"], SortColumn);
	        this.tertiary = this.convertValues(source["tertiary"], SortColumn);
	        this.quaternary = this.convertValues(source["quaternary"], SortColumn);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TableState {
	    search?: string;
	    sort?: ViewSort;
	    page?: number;
	    pageSize?: number;
	    filters?: Record<string, Array<string>>;
	    rangeFilters?: Record<string, RangeFilter>;
	    selectedIndex?: number;
	
	    static createFrom(source: any = {}) {
	        return new TableState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.search = source["search"];
	        this.sort = this.convertValues(source["sort"], ViewSort);
	        this.page = source["page"];
	        this.pageSize = source["pageSize"];
	        this.filters = source["filters"];
	        this.rangeFilters = this.convertValues(source["rangeFilters"], RangeFilter, true);
	        this.selectedIndex = source["selectedIndex"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UIPreferences {
	    theme: string;
	    darkMode: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UIPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.darkMode = source["darkMode"];
	    }
	}

}

export namespace db {
	
	export class Paint {
	    id: string;
	    brand: string;
	    name: string;
	    series: number;
	    opacity: string;
	    pigments: string;
	    r: number;
	    g: number;
	    b: number;
	    hex: string;
	    labL: number;
	    labA: number;
	    labB: number;
	    owned: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Paint(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.brand = source["brand"];
	        this.name = source["name"];
	        this.series = source["series"];
	        this.opacity = source["opacity"];
	        this.pigments = source["pigments"];
	        this.r = source["r"];
	        this.g = source["g"];
	        this.b = source["b"];
	        this.hex = source["hex"];
	        this.labL = source["labL"];
	        this.labA = source["labA"];
	        this.labB = source["labB"];
	        this.owned = source["owned"];
	    }
	}
	export class MatchPart {
	    id: number;
	    matchId: number;
	    paintId: string;
	    parts: number;
	    paint: Paint;
	
	    static createFrom(source: any = {}) {
	        return new MatchPart(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.matchId = source["matchId"];
	        this.paintId = source["paintId"];
	        this.parts = source["parts"];
	        this.paint = this.convertValues(source["paint"], Paint);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ColorMatch {
	    id: number;
	    colorId: number;
	    matchType: string;
	    rank: number;
	    deltaE: number;
	    matchRating: string;
	    parts: MatchPart[];
	
	    static createFrom(source: any = {}) {
	        return new ColorMatch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.colorId = source["colorId"];
	        this.matchType = source["matchType"];
	        this.rank = source["rank"];
	        this.deltaE = source["deltaE"];
	        this.matchRating = source["matchRating"];
	        this.parts = this.convertValues(source["parts"], MatchPart);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class FavoritePart {
	    id: number;
	    favoriteId: number;
	    paintId: string;
	    parts: number;
	    paint: Paint;
	
	    static createFrom(source: any = {}) {
	        return new FavoritePart(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.favoriteId = source["favoriteId"];
	        this.paintId = source["paintId"];
	        this.parts = source["parts"];
	        this.paint = this.convertValues(source["paint"], Paint);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Favorite {
	    id: number;
	    name: string;
	    notes: string;
	    r: number;
	    g: number;
	    b: number;
	    hex: string;
	    createdAt: string;
	    parts: FavoritePart[];
	
	    static createFrom(source: any = {}) {
	        return new Favorite(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.notes = source["notes"];
	        this.r = source["r"];
	        this.g = source["g"];
	        this.b = source["b"];
	        this.hex = source["hex"];
	        this.createdAt = source["createdAt"];
	        this.parts = this.convertValues(source["parts"], FavoritePart);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	export class PaintFilterOptions {
	    brands: string[];
	    opacities: string[];
	
	    static createFrom(source: any = {}) {
	        return new PaintFilterOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.brands = source["brands"];
	        this.opacities = source["opacities"];
	    }
	}
	export class Project {
	    id: number;
	    name: string;
	    imagePath: string;
	    thumbnailPath: string;
	    nColors: number;
	    tileSize: number;
	    posterize: boolean;
	    smoothingPasses: number;
	    aspectRatio: string;
	    matchOwnedOnly: boolean;
	    notes: string;
	    createdAt: string;
	    updatedAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.imagePath = source["imagePath"];
	        this.thumbnailPath = source["thumbnailPath"];
	        this.nColors = source["nColors"];
	        this.tileSize = source["tileSize"];
	        this.posterize = source["posterize"];
	        this.smoothingPasses = source["smoothingPasses"];
	        this.aspectRatio = source["aspectRatio"];
	        this.matchOwnedOnly = source["matchOwnedOnly"];
	        this.notes = source["notes"];
	        this.createdAt = source["createdAt"];
	        this.updatedAt = source["updatedAt"];
	    }
	}
	export class ProjectColor {
	    id: number;
	    projectId: number;
	    sortOrder: number;
	    r: number;
	    g: number;
	    b: number;
	    hex: string;
	    pixelCount: number;
	
	    static createFrom(source: any = {}) {
	        return new ProjectColor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.projectId = source["projectId"];
	        this.sortOrder = source["sortOrder"];
	        this.r = source["r"];
	        this.g = source["g"];
	        this.b = source["b"];
	        this.hex = source["hex"];
	        this.pixelCount = source["pixelCount"];
	    }
	}
	export class ProjectColorWithMatches {
	    color: ProjectColor;
	    matches: ColorMatch[];
	
	    static createFrom(source: any = {}) {
	        return new ProjectColorWithMatches(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.color = this.convertValues(source["color"], ProjectColor);
	        this.matches = this.convertValues(source["matches"], ColorMatch);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

