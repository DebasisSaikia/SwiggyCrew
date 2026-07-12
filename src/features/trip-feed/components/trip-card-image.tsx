import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

// Generic low-fidelity blurhash placeholder shown while the remote hero image loads.
const PLACEHOLDER_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type TripCardImageProps = {
  uri: string;
  recyclingKey: string;
  width: number;
  height: number;
};

export const TripCardImage = memo(function TripCardImage({
  uri,
  recyclingKey,
  width,
  height,
}: TripCardImageProps) {
  return (
    <Image
      source={{ uri, width, height }}
      recyclingKey={recyclingKey}
      placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
      placeholderContentFit="cover"
      contentFit="cover"
      transition={200}
      style={[styles.image, { aspectRatio: width / height }]}
    />
  );
});

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
});
