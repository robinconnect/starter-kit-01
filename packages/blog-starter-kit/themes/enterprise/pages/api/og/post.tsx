import { resizeImage } from '@starter-kit/utils/image';
import { ImageResponse } from '@vercel/og';
import { type NextRequest } from 'next/server';
import { DEFAULT_AVATAR } from '../../../utils/const';

export const config = {
	runtime: 'edge',
};

const fontRegular = fetch(
	new URL('../../../assets/PlusJakartaSans-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontMedium = fetch(
	new URL('../../../assets/PlusJakartaSans-Medium.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontSemiBold = fetch(
	new URL('../../../assets/PlusJakartaSans-SemiBold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontBold = fetch(new URL('../../../assets/PlusJakartaSans-Bold.ttf', import.meta.url)).then(
	(res) => res.arrayBuffer(),
);

const fontExtraBold = fetch(
	new URL('../../../assets/PlusJakartaSans-ExtraBold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
	const [fontDataRegular, fontDataMedium, fontDataSemiBold, fontDataBold, fontDataExtraBold] =
		await Promise.all([fontRegular, fontMedium, fontSemiBold, fontBold, fontExtraBold]);

	const { searchParams } = new URL(req.url);

	const ogData = JSON.parse(atob(searchParams.get('og') as string));
	const {
		author: authorEncoded,
		isDefaultModeDark,
		readTime,
		reactions,
		domain,
		title: encodedTitle,
		bgcolor,
	} = ogData;
	const author = decodeURIComponent(authorEncoded);
	const photo = ogData.photo ? resizeImage(ogData.photo, {}) : DEFAULT_AVATAR;
	const title = decodeURIComponent(encodedTitle);

	let bannerBackground = isDefaultModeDark ? '#0f172a' : '#f3f4f6';
	let titleTailwindClass;

	if (bgcolor) {
		bannerBackground = bgcolor;
	}

	if (title.length <= 79) {
		titleTailwindClass = 'text-7xl';
	} else if (title.length > 79 && title.length <= 109) {
		titleTailwindClass = 'text-6xl';
	} else {
		titleTailwindClass = 'text-5xl';
	}

	return new ImageResponse(
		(
			<div
				style={{
					fontFamily: '"Plus Jakarta Sans"',
					backgroundColor: bannerBackground,
				}}
				tw="relative flex h-full w-full flex-col p-8 subpixel-antialiased"
			>
				{/* if blog is set to open in dark mode, then change text-slate-900 to text-white and change bg-white to bg-black */}
				<div
					tw={`relative flex flex-col items-center p-10 ${
						isDefaultModeDark ? 'bg-black' : 'bg-white'
					} ${
						isDefaultModeDark ? 'text-white' : 'text-slate-900'
					} h-full w-full rounded-xl shadow-md`}
				>
					<div tw="absolute -top-px -left-px -right-px -bottom-px rounded-xl border-2 border-black/5" />
					<div tw="flex w-full flex-row items-center">
						{/* if author image is not available, use the default author image (DEFAULT_AVATAR) from const */}
						<img tw="mr-5 h-16 w-16 rounded-full" alt="name" src={photo} />
						<div tw="flex flex-col items-start">
							{/* Author name, even if it's team */}
							<p tw="m-0 text-2xl font-bold leading-tight">{author}</p>

							{/* Show custom domain, then hashnode.dev domain */}
							{/* Show team domain, if team */}
							<p tw="m-0 text-2xl leading-tight opacity-60">{domain}</p>
						</div>
					</div>
					<div tw="flex flex-1 flex-col items-center justify-center">
						{/* if title char count is >= 110 change the tailwind text-* class to text-5xl */}
						{/* if title char count is 80 - 109 change the tailwind text-* class to text-6xl */}
						{/* if title char count is <=79 change the tailwind text-* class to text-7xl */}
						<p tw={`${titleTailwindClass} mb-5 mt-0 text-center font-extrabold leading-tight`}>
							{title}
						</p>
					</div>
					<div tw="flex w-full flex-row items-center justify-between leading-none">
						<div tw="flex flex-row items-center">
							{reactions && (
								<div tw="mr-10 flex flex-row items-center">
									<svg
										fill="#64748b"
										style={{
											height: '2rem',
											width: '2rem',
											marginRight: '0.75rem',
										}}
										viewBox="0 0 512 512"
									>
										<path d="m255.1 96 12-11.98C300.6 51.37 347 36.51 392.6 44.1c68.9 11.48 119.4 71.1 119.4 141v5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.59 300.4C17.23 272.1 0 232.4 0 190.9v-5.8c0-69.9 50.52-129.52 119.4-141 44.7-7.59 92 7.27 124.6 39.92L255.1 96zm0 45.3-33.7-34.7c-25.3-25.29-61.4-36.83-96.7-30.94-53.49 8.92-93.6 55.24-93.6 109.44v5.8c0 32.7 14.45 63.8 38.32 86.1L250.1 445.7c1.6 1.5 3.7 2.3 5 2.3 3.1 0 5.2-.8 6.8-2.3L442.6 277c23.8-22.3 37.4-53.4 37.4-86.1v-5.8c0-54.2-39.2-100.52-92.7-109.44-36.2-5.89-71.4 5.65-96.7 30.94l-35.5 34.7z" />
									</svg>
									<p tw="m-0 text-2xl font-medium opacity-60">{reactions}</p>
								</div>
							)}
						</div>
						{readTime && (
							<div tw="flex flex-row items-center">
								<svg
									fill="#64748b"
									style={{
										height: '2rem',
										width: '2rem',
										marginRight: '0.75rem',
									}}
									viewBox="0 0 576 512"
								>
									<path d="M540.9 56.77c-45.95-16.66-90.23-24.09-129.1-24.75-60.7.94-102.7 17.45-123.8 27.72-21.1-10.27-64.1-26.8-123.2-27.74-40-.05-84.4 8.35-129.7 24.77C14.18 64.33 0 84.41 0 106.7v302.9c0 14.66 6.875 28.06 18.89 36.8 11.81 8.531 26.64 10.98 40.73 6.781 118.9-36.34 209.3 19.05 214.3 22.19C277.8 477.6 281.2 480 287.1 480c6.52 0 10.12-2.373 14.07-4.578 10.78-6.688 98.3-57.66 214.3-22.27 14.11 4.25 28.86 1.75 40.75-6.812C569.1 437.6 576 424.2 576 409.6V106.7c0-22.28-14.2-42.35-35.1-49.93zM272 438.1c-24.95-12.03-71.01-29.37-130.5-29.37-27.83 0-58.5 3.812-91.19 13.77-4.406 1.344-9 .594-12.69-2.047C34.02 417.8 32 413.1 32 409.6V106.7c0-8.859 5.562-16.83 13.86-19.83C87.66 71.7 127.9 63.95 164.5 64c51.8.81 89.7 15.26 107.5 23.66V438.1zm272-28.5c0 4.375-2.016 8.234-5.594 10.84-3.766 2.703-8.297 3.422-12.69 2.125C424.1 391.6 341.3 420.4 304 438.3V87.66c17.8-8.4 55.7-22.85 107.4-23.66 35.31-.063 76.34 7.484 118.8 22.88 8.2 3 13.8 10.96 13.8 19.82v302.9z" />
								</svg>
								<p tw="m-0 text-2xl font-medium opacity-60">{readTime} min read</p>
							</div>
						)}
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Typewriter',
					data: fontDataRegular,
					style: 'normal',
					weight: 400,
				},
				{
					name: 'Typewriter',
					data: fontDataMedium,
					style: 'normal',
					weight: 500,
				},
				{
					name: 'Typewriter',
					data: fontDataSemiBold,
					style: 'normal',
					weight: 600,
				},
				{
					name: 'Typewriter',
					data: fontDataBold,
					style: 'normal',
					weight: 700,
				},
				{
					name: 'Typewriter',
					data: fontDataExtraBold,
					style: 'normal',
					weight: 800,
				},
			],
		},
	);
}
