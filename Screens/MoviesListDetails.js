import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Genres from '../components/Genres';
import Rating from '../components/Rating';
import { SharedElement } from 'react-navigation-shared-element';
import { height, width, fonts } from '../config/theme';
import * as Animatable from 'react-native-animatable';
import { getActors } from '../config/data/movies';
import { StatusBar } from 'expo-status-bar';
const TOP_HEADER_HEIGHT = height * 0.38;
const SPACING = 20;
const FONTCOLOR = '#fff';
const AnimatableScrollView =
  Animatable.createAnimatableComponent(ScrollView);
const DURATION = 150;
const HEADER_DURATION = 1000;
const HEADER_DELAY = 0;
const slideIn = {
  0: { translateX: 250 },
  1: { translateX: 0 },
};
const slideInBackwards = {
  0: { translateX: 0 },
  1: { translateX: 250 },
};
const fadeInBottom = {
  0: { opacity: 0, translateX: 100 },
  1: { opacity: 1, translateX: 0 },
};

const MoviesListDetails = ({ navigation, route }) => {
  const [cast, setCast] = React.useState(null);
  const { item, nextImage, prevImage } = route.params;
  const prevImageRef = React.useRef();
  const nextImageRef = React.useRef();
  const imageRef = React.useRef();
  const scrollViewRef = React.useRef();
  React.useEffect(() => {
    const fetchData = async () => {
      const cast = await getActors(item.id);
      // Add empty items to create fake space
      // [empty_item, ...movies, empty_item]
      setCast(cast);
    };

    if (!cast) {
      fetchData(item.id);
    }
  }, [item.id]);

  return (
    <View style={styles.container}>
      <Animatable.Image
        useNativeDriver
        ref={imageRef}
        duration={HEADER_DURATION}
        easing="ease-in-out"
        animation={slideIn}
        delay={HEADER_DELAY}
        source={{ uri: item.poster }}
        blurRadius={2}
        style={{
          height,
          width,
          backgroundColor: '#000',
          opacity: 0.5,
        }}
      />
      <View
        style={{
          position: 'absolute',
          flexWrap: 'nowrap',
          top: 0,
          width,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Animatable.Image
          useNativeDriver
          ref={prevImageRef}
          duration={HEADER_DURATION}
          easing="ease-in-out"
          animation={slideIn}
          delay={HEADER_DELAY + 200}
          source={{ uri: prevImage }}
          blurRadius={5}
          style={[
            styles.image,
            styles.secondaryImage,
            {
              left: 0,
              bottom: 60,
              backgroundColor: '#000',
              opacity: 0.8,
            },
          ]}
        />
        <Animatable.Image
          useNativeDriver
          ref={nextImageRef}
          duration={HEADER_DURATION}
          easing="ease-in-out"
          animation={slideIn}
          delay={HEADER_DELAY + 350}
          source={{ uri: nextImage }}
          blurRadius={2}
          style={[
            styles.image,
            styles.secondaryImage,
            {
              right: 0,
              bottom: 60,
              backgroundColor: '#000',
              opacity: 0.8,
            },
          ]}
        />
        <Animatable.Image
          useNativeDriver
          ref={imageRef}
          duration={HEADER_DURATION}
          easing="ease-in-out"
          animation={slideIn}
          delay={HEADER_DELAY}
          source={{ uri: item.poster }}
          style={[styles.image, { marginTop: SPACING }]}
        />
      </View>

      <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <SharedElement
          id={`item.${item.key}.image`}
          style={styles.posterImage}
        >
          <Image
            source={{ uri: item.poster }}
            style={styles.posterImage}
          />
        </SharedElement>
      </View>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { top: TOP_HEADER_HEIGHT, padding: SPACING },
        ]}
      >
        <SharedElement
          id={`item.${item.key}.backdrop`}
          style={[StyleSheet.absoluteFillObject]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: '#fff',
                opacity: 0.5,
                borderRadius: 34,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              },
            ]}
          />
        </SharedElement>
        <SharedElement id={`item.${item.key}.meta`}>
          <View
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              style={{
                fontSize: 24,
                color: FONTCOLOR,
                fontFamily: fonts.bold,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {item.title}
            </Text>
            <Rating rating={item.rating} />
            <Genres genres={item.genres} />
          </View>
        </SharedElement>
        <AnimatableScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.Text
            useNativeDriver
            animation={fadeInBottom}
            delay={DURATION + 300}
            style={{
              ...fonts.montserratBold,
              fontSize: 18,
              marginBottom: SPACING,
              color: FONTCOLOR,
            }}
          >
            Actors
          </Animatable.Text>
          {cast && (
            <FlatList
              data={cast}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{
                justifyContent: 'space-evenly',
              }}
              horizontal
              decelerationRate="fast"
              // 2 by 2
              style={{ marginBottom: SPACING }}
              snapToInterval={width * 0.66 + SPACING * 2}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: cast, index }) => {
                return (
                  <Animatable.View
                    useNativeDriver
                    animation={fadeInBottom}
                    delay={DURATION + 300 + (index + 1) * 150}
                    style={{
                      marginRight: SPACING,
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={{ uri: cast.imageUri }}
                      style={{
                        borderRadius: 16,
                        width: width * 0.33,
                        height: width * 0.4,
                        resizeMode: 'cover',
                        marginBottom: SPACING / 2,
                      }}
                    />
                    <Text
                      style={{
                        ...fonts.montserratRegular,
                        fontSize: 12,
                        color: FONTCOLOR,
                      }}
                    >
                      {cast.name}
                    </Text>
                  </Animatable.View>
                );
              }}
            />
          )}
          <Animatable.Text
            useNativeDriver
            animation={fadeInBottom}
            delay={DURATION + 900}
            style={{
              ...fonts.montserratBold,
              fontSize: 18,
              color: FONTCOLOR,
            }}
          >
            Introduction
          </Animatable.Text>

          <Animatable.Text
            useNativeDriver
            animation={fadeInBottom}
            delay={DURATION + 1000}
            style={{
              ...fonts.montserratBold,
              fontSize: 12,
              color: FONTCOLOR,
            }}
          >
            Release Date : {item.releaseDate}
          </Animatable.Text>

          <Animatable.Text
            useNativeDriver
            animation={fadeInBottom}
            delay={DURATION + 1100}
            style={{
              ...fonts.montserratRegular,
              fontSize: 13,
              lineHeight: 20,
              color: FONTCOLOR,
            }}
          >
            {item.description}
          </Animatable.Text>
        </AnimatableScrollView>
      </View>
      {/* <AntDesign
        name="arrowleft"
        size={24}
        style={{ position: 'absolute', top: SPACING, left: SPACING }}
        color={'#fff'}
        onPress={() => {
          imageRef.current.animate(slideInBackwards, 500),
            scrollViewRef.current.fadeOut(400);
          Promise.all([
            nextImageRef.current.animate(slideInBackwards, 200),
            prevImageRef.current.animate(slideInBackwards, 300),
          ]).then(() => {
            navigation.goBack();
          });
        }}
      /> */}
    </View>
  );
};

MoviesListDetails.sharedElements = (route, otherRoute, showing) => {
  const { item } = route.params;
  return [
    {
      id: `item.${item.key}.backdrop`,
      // animation: 'fade-out',
      // resize: 'none'
    },
    {
      id: `item.${item.key}.meta`,
      animation: 'fade',
      resize: 'none',
    },
    {
      id: `item.${item.key}.image`,
    },
  ];
};
export default MoviesListDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  secondaryImage: {
    position: 'absolute',
    width: width * 0.33,
    height: width * 0.33 * 1.5,
    bottom: (width * 0.33 * 1.5) / 2,
  },
  image: {
    width: width * 0.55,
    height: width * 0.55 * 1.5,
    resizeMode: 'contain',
    borderRadius: 16,
  },

  imageBackground: {
    width: width,
    height: height,
    // blur background
    backgroundColor: '#000',
    opacity: 0.9,
  },

  posterImage: {
    opacity: 0,
    transform: [{ scale: 0 }],
    width: 10,
    height: 20,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
  },
});
