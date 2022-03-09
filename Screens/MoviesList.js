/**
 * Inspiration: https://dribbble.com/shots/8257559-Movie-2-0
 *
 */
import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { getMovies } from '../config/data/movies';
import Genres from '../components/Genres';
import Rating from '../components/Rating';
import { LinearGradient } from 'expo-linear-gradient';
import { width, height } from '../config/theme';
import { SharedElement } from 'react-navigation-shared-element';
export const SPACING = 10;
export const ITEM_SIZE =
  Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = React.memo(({ movies, scrollX }) => {
  return (
    <View
      style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}
    >
      <StatusBar hidden />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.key + '-backdrop'}
        removeClippedSubviews={Platform.OS === 'ios'}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_SIZE, index * ITEM_SIZE],
            outputRange: [0, width],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              removeClippedSubviews={Platform.OS === 'ios'}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                blurRadius={2}
                source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'black']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
});

export default function MoviesList({ navigation }) {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const backdropAnimated = React.useRef(
    new Animated.Value(0),
  ).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      setMovies(movies.slice(0, 10));
    };

    if (movies.length === 0) {
      fetchData(movies);
    }
  }, []);

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={backdropAnimated} />

      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => String(item.key)}
        horizontal
        bounces={false}
        decelerationRate={'fast'}
        renderToHardwareTextureAndroid
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: EMPTY_ITEM_SIZE,
        }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
            listener: (event) => {
              backdropAnimated.setValue(
                event.nativeEvent.contentOffset.x,
              );
            },
          },
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate('MoviesListDetails', {
                  item,
                  prevImage: movies[index - 1]?.poster,
                  nextImage: movies[index + 1]?.poster,
                })
              }
            >
              <View style={{ width: ITEM_SIZE }}>
                <Animated.View
                  style={{
                    marginHorizontal: SPACING,
                    padding: 10,
                    alignItems: 'center',
                    transform: [{ translateY }],
                    borderColor: '#141E27',
                    borderWidth: 1,
                    borderRadius: 20,
                  }}
                >
                  <SharedElement
                    id={`item.${item.key}.backdrop`}
                    style={[StyleSheet.absoluteFillObject]}
                  >
                    <Animated.View
                      style={[
                        StyleSheet.absoluteFillObject,
                        {
                          borderRadius: 34,
                        },
                      ]}
                    />
                  </SharedElement>
                  <SharedElement
                    id={`item.${item.key}.image`}
                    style={styles.posterImage}
                  >
                    <Image
                      source={{ uri: item.poster }}
                      style={styles.posterImage}
                    />
                  </SharedElement>
                  <SharedElement id={`item.${item.key}.meta`}>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{ fontSize: 24, color: '#fff' }}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {item.title}
                      </Text>
                      <Rating rating={item.rating} />
                      <Genres genres={item.genres} />
                    </View>
                  </SharedElement>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
