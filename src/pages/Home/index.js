import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts} from '../../utils';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {apiURL, getData, webURL} from '../../utils/localStorage';

const {width} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user, setUser] = useState({});
  const [featuredProducts, setProduct] = useState([]);

  const navigateToDetail = product => {
    navigation.navigate('ProdukDetail', {product});
  };
  const getTransaksi = () => {
    axios
      .post(apiURL + 'listdata', {
        modul: 'jasa',
      })
      .then(res => {
        console.log(res.data);
        setProduct(res.data);
      });
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    getData('user').then(u => setUser(u));
    if (isFocused) {
      getTransaksi();
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, '#FEFAE0']}
        style={styles.headerGradient}
        start={{x: 0, y: 0}}
        end={{x: 0.9, y: 1}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>SELAMAT DATANG,</Text>
            <Text style={styles.greetingText}>{user.nama_customer}</Text>
          </View>
          <FastImage
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {featuredProducts.map(product => (
            <TouchableOpacity
              key={product.id_jasa}
              style={styles.productCard}
              onPress={() => navigateToDetail(product)}>
              <View style={styles.cardContent}>
                <FastImage
                  source={{
                    uri: webURL + product.foto_jasa,
                  }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.nama_jasa}</Text>
                  <Text style={styles.productPrice}>
                    {new Intl.NumberFormat().format(product.harga)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    top: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  greetingText: {
    fontFamily: fonts.secondary[600],
    fontSize: 15,
    color: 'white',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 30, // ganti dari 80 ke 30
  },
  productCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  productImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  productInfo: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 8,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontFamily: fonts.secondary[700],
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
    flexShrink: 1,
  },
  productPrice: {
    fontFamily: fonts.secondary[600],
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
  },
});
