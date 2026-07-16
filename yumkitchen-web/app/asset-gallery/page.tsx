import type {Metadata} from 'next';
import {AssetGalleryClient, type ReviewAsset} from './AssetGalleryClient';
import assetData from './assets.json';

export const metadata: Metadata = {
  title: 'creative asset review | yum! Kitchen and Patticake',
  description: 'Internal review gallery for the yum! Kitchen and Patticake social launch assets.',
  robots: {index: false, follow: false},
};

export default function AssetGalleryPage() {
  return <AssetGalleryClient assets={assetData as unknown as ReviewAsset[]} />;
}
