export type VendorDoc = Document & {
	webkitExitFullscreen?: () => void;
	msExitFullscreen?: () => void;

	webkitFullscreenElement?: Element | null;
	msFullscreenElement?: Element | null;
};

export type VendorEl = HTMLElement & {
	requestFullscreen?(): Promise<void>;
	webkitRequestFullscreen?(): Promise<void>;
	msRequestFullscreen?(): Promise<void>;
};

export interface Format {
	format_id: string;
	format_note: string;
	ext: string;
	vcodec: string;
	acodec: string;
	url: string;
	width?: number;
	height?: number;
	fps?: number;
	resolution?: string;
	filesize_in_bytes?: number;
};

export interface Video {
	id: string;
	title: string;
	url: string;
	thumbnail: string;
	duration_in_seconds: number;
	formats: Format[];
	view_count: number;
};

export type SearchResult = Video[];
