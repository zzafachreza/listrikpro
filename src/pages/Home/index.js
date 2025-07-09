import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts} from '../../utils';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user] = useState({});
  const [featuredProducts] = useState([
    {
      id: 1,
      name: 'Nidi & Slo Industri Daya 450 VA - 10600 VA',
      price: 75000,
      priceTitle: 'Rp 75.000 ',
      description: `Selamat datang di toko kami!

Kami melayani jasa penerbitan Sertifikat Laik Operasi (SLO) dan Nomor Identitas Instalasi (NIDI) resmi dan terpercaya.

✔ Proses cepat & sesuai regulasi

✔ Dokumen resmi diakui oleh PLN

✔ Cocok untuk perumahan, usaha, dan proyek


 Konsultasi gratis

 Pelayanan ramah & profesional

Hubungi kami jika ada pertanyaan, kami siap bantu dari awal hingga sertifikat terbit.


 Catatan Penting:

Pada saat pendaftaran, wajib mengisi data dengan benar dan valid sesuai dengan lokasi tempat pemasangan instalasi listrik.

Data yang tidak sesuai dapat menghambat proses penerbitan sertifikat.


Pastikan informasi seperti:

• Nama pemilik

• Alamat lengkap

• Nomor meter/ID pelanggan (jika ada)

• Jenis bangunan/usaha

sudah tepat dan akurat.


Setelah Order silahkan Chat kepada kami untuk data pelanggan:

Nama:

Nomor pengenal :

Alamat:

Desa:

Kecamatan:

Kabupaten:

Daya: V/A


Sebelum checkout chat admin terlebih dahulu ya untuk memastikan wilayah penerbitan sertifikasi`,
      image: require('../../assets/product_placeholder.png'),
      details: [
        'Bahan: 100% Cotton Premium',
        'Tersedia ukuran S, M, L, XL',
        'Warna: Navy, Black, Grey',
        'Perawatan: Cuci dengan air dingin'
      ]
    },
    {
      id: 2,
      name: 'Nidi Slo Home Charging Daya 450 VA - 10600 VA',
      price: 75000,
      priceTitle: 'Rp 75.000 ',
      description: `Selamat datang di toko kami!

Kami melayani jasa penerbitan Sertifikat Laik Operasi (SLO) dan Nomor Identitas Instalasi (NIDI) resmi dan terpercaya.

✔ Proses cepat & sesuai regulasi

✔ Dokumen resmi diakui oleh PLN

✔ Cocok untuk perumahan, usaha, dan proyek


 Konsultasi gratis

 Pelayanan ramah & profesional

Hubungi kami jika ada pertanyaan, kami siap bantu dari awal hingga sertifikat terbit.


 Catatan Penting:

Pada saat pendaftaran, wajib mengisi data dengan benar dan valid sesuai dengan lokasi tempat pemasangan instalasi listrik.

Data yang tidak sesuai dapat menghambat proses penerbitan sertifikat.


Pastikan informasi seperti:

• Nama pemilik

• Alamat lengkap

• Nomor meter/ID pelanggan (jika ada)

• Jenis bangunan/usaha

sudah tepat dan akurat.


Setelah Order silahkan Chat kepada kami untuk data pelanggan:

Nama:

Nomor pengenal :

Alamat:

Desa:

Kecamatan:

Kabupaten:

Daya: V/A


Sebelum checkout chat admin terlebih dahulu ya untuk memastikan wilayah penerbitan sertifikasi`,
      image: require('../../assets/product_placeholder2.png'),
      details: [
        'Bahan: Katun Pique 200gsm',
        'Tersedia ukuran S, M, L, XL',
        'Warna: White, Blue, Maroon',
        'Desain kerah rib dengan 3 kancing'
      ]
    },
  ]);

  const navigateToDetail = (product) => {
    navigation.navigate('ProdukDetail', { product });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8AB05', '#006DAB']}
        style={styles.headerGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Selamat datang,</Text>
            <Text style={styles.greetingText}>{user.nama_lengkap || 'User'}</Text>
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
        {/* Product Cards */}
        <View style={styles.productsContainer}>
          {featuredProducts.map((product, index) => (
            <TouchableOpacity 
              key={product.id} 
              style={[
                styles.productCard,
                index === 0 && {marginTop: -50} // First card overlaps the header
              ]}
              onPress={() => navigateToDetail(product)}>
              
              <FastImage
                source={product.image}
                style={styles.productImage}
                resizeMode="contain"
              />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.priceTitle}</Text>
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
    top: 10
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  greetingText: {
    fontFamily: fonts.secondary[600],
    fontSize: 20,
    color: 'white',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  productsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 80
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  productInfo: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignSelf: 'stretch',
  },
  productName: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});