// To parse this data:
//
//   import { Convert, Itrack } from "./file";
//
//   const itrack = Convert.toItrack(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Itrack {
    tracks: Track[];
}

export interface Track {
    album:             Album;
    artists:           Artist[];
    available_markets: string[];
    disc_number:       number;
    duration_ms:       number;
    explicit:          boolean;
    external_ids:      ExternalIDS;
    external_urls:     ExternalUrls;
    href:              string;
    id:                string;
    is_local:          boolean;
    name:              string;
    popularity:        number;
    preview_url:       string;
    track_number:      number;
    type:              string;
    uri:               string;
}

export interface Album {
    album_type:             string;
    artists:                Artist[];
    available_markets:      string[];
    external_urls:          ExternalUrls;
    href:                   string;
    id:                     string;
    images:                 Image[];
    name:                   string;
    release_date:           Date;
    release_date_precision: string;
    total_tracks:           number;
    type:                   string;
    uri:                    string;
}

export interface Artist {
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    name:          string;
    type:          string;
    uri:           string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Image {
    url:    string;
    width:  number;
    height: number;
}

export interface ExternalIDS {
    isrc: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toItrack(json: string): Itrack {
        return cast(JSON.parse(json), r("Itrack"));
    }

    public static itrackToJson(value: Itrack): string {
        return JSON.stringify(uncast(value, r("Itrack")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Itrack": o([
        { json: "tracks", js: "tracks", typ: a(r("Track")) },
    ], false),
    "Track": o([
        { json: "album", js: "album", typ: r("Album") },
        { json: "artists", js: "artists", typ: a(r("Artist")) },
        { json: "available_markets", js: "available_markets", typ: a("") },
        { json: "disc_number", js: "disc_number", typ: 0 },
        { json: "duration_ms", js: "duration_ms", typ: 0 },
        { json: "explicit", js: "explicit", typ: true },
        { json: "external_ids", js: "external_ids", typ: r("ExternalIDS") },
        { json: "external_urls", js: "external_urls", typ: r("ExternalUrls") },
        { json: "href", js: "href", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "is_local", js: "is_local", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "popularity", js: "popularity", typ: 0 },
        { json: "preview_url", js: "preview_url", typ: "" },
        { json: "track_number", js: "track_number", typ: 0 },
        { json: "type", js: "type", typ: "" },
        { json: "uri", js: "uri", typ: "" },
    ], false),
    "Album": o([
        { json: "album_type", js: "album_type", typ: "" },
        { json: "artists", js: "artists", typ: a(r("Artist")) },
        { json: "available_markets", js: "available_markets", typ: a("") },
        { json: "external_urls", js: "external_urls", typ: r("ExternalUrls") },
        { json: "href", js: "href", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "images", js: "images", typ: a(r("Image")) },
        { json: "name", js: "name", typ: "" },
        { json: "release_date", js: "release_date", typ: Date },
        { json: "release_date_precision", js: "release_date_precision", typ: "" },
        { json: "total_tracks", js: "total_tracks", typ: 0 },
        { json: "type", js: "type", typ: "" },
        { json: "uri", js: "uri", typ: "" },
    ], false),
    "Artist": o([
        { json: "external_urls", js: "external_urls", typ: r("ExternalUrls") },
        { json: "href", js: "href", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "uri", js: "uri", typ: "" },
    ], false),
    "ExternalUrls": o([
        { json: "spotify", js: "spotify", typ: "" },
    ], false),
    "Image": o([
        { json: "url", js: "url", typ: "" },
        { json: "width", js: "width", typ: 0 },
        { json: "height", js: "height", typ: 0 },
    ], false),
    "ExternalIDS": o([
        { json: "isrc", js: "isrc", typ: "" },
    ], false),
};
