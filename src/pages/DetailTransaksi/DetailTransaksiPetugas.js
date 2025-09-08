import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fonts, windowWidth} from '../../utils';
import {MyButton, MyGap, MyHeader, MyInput} from '../../components';
import {ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {apiURL, webURL} from '../../utils/localStorage';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import {useToast} from 'react-native-toast-notifications';
import moment from 'moment';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';

export default function DetailTransaksiPetugas({route, navigation}) {
  // Get transaction data from route params
  const transaksi = route.params?.transaction || route.params;
  console.log(transaksi);

  const [kirim, setKirim] = useState({
    id_transaksi: transaksi.id_transaksi,
    newbukti_petugas: null,
    catatan: '',
  });

  const toast = useToast();
  const simpanGambar = () => {
    try {
      axios.post(apiURL + 'update_transaksi', kirim).then(res => {
        console.log(res.data);
        if (res.data.status == 200) {
          toast.show(res.data.message, {
            type: 'success',
          });

          navigation.replace('HomePetugas');
        }
      });
      console.log('Berhasil menyimpan transaksi', kirim); // <-- Tambahkan ini
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const selectImageSource = () => {
    launchCamera(
      {
        includeBase64: true,
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          console.log(response.assets[0]);
          setKirim({
            ...kirim,
            newbukti_petugas: `data:${response.assets[0].type};base64, ${response.assets[0].base64}`,
          });
        }
      },
    );
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Menunggu Konfirmasi':
        return colors.warning || '#FF9800';
      case 'Sedang Proses':
        return colors.success || '#2c6df8ff';
      case 'Sedang Pengiriman':
        return colors.success || '#634b9bff';
      case 'Selesai':
        return colors.success || '#4CAF50';
      case 'Batal':
        return colors.danger || '#F44336';
      default:
        return colors.secondary || '#757575';
    }
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const openProofImage = () => {
    if (transaksi.bukti_transaksi) {
      const imageUrl = `${webURL || 'https://your-domain.com/'}${
        transaksi.bukti_transaksi
      }`;
      Linking.openURL(imageUrl).catch(() => {
        Alert.alert('Error', 'Tidak dapat membuka gambar');
      });
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const renderPurchaseDetails = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Detail Pembelian</Text>
      <Text
        style={{
          fontFamily: fonts.secondary[800],
          color: colors.primary,
          fontSize: 16,
          marginBottom: 10,
        }}>
        {transaksi.nama_jasa}
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Harga Satuan</Text>
        <Text style={styles.value}>{formatCurrency(transaksi.harga)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Jumlah</Text>
        <Text style={styles.value}>{transaksi.jumlah}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Harga</Text>
        <Text style={styles.value}>{formatCurrency(transaksi.total)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(transaksi.total)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MyHeader title="Detail Transaksi" onPress={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Kode Transaksi</Text>
            <Text style={styles.value}>{transaksi.kode}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>
              {moment(transaksi.tanggal).format('DD MMMM YYYY')}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(transaksi.status)},
              ]}>
              <Text style={styles.statusText}>{transaksi.status}</Text>
            </View>
          </View>
        </View>

        {/* Transaction Content Based on Type */}

        {/* Purchase Details */}
        {renderPurchaseDetails()}

        {/* Customer Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Pembeli</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Nama</Text>
            <Text style={styles.value}>{transaksi.nama_customer}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{transaksi.username}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Telepon</Text>
            <Text style={styles.value}>{transaksi.telepon_customer}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Alamat</Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.primary[600],
              fontSize: 14,
            }}>
            {transaksi.alamat_customer}
          </Text>
          <MyButton
            onPress={() =>
              Linking.openURL(
                'https://www.google.com/maps/search/' +
                  transaksi.alamat_customer,
              )
            }
            title="Lihat Google Maps"
            Icons="location-outline"
            iconColor="white"
          />
        </View>

        {/* Payment Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Pembayaran</Text>

          {transaksi.pembayaran && (
            <View style={styles.row}>
              <Text style={styles.label}>Metode Pembayaran</Text>
              <Text style={styles.value}>{transaksi.pembayaran}</Text>
            </View>
          )}

          {transaksi.bukti_transaksi && (
            <View style={styles.proofContainer}>
              <Text style={styles.label}>Bukti Transfer</Text>
              <TouchableOpacity
                style={styles.proofButton}
                onPress={openProofImage}>
                <Icon
                  name="image-outline"
                  size={20}
                  color={colors.primary || '#007AFF'}
                />
                <Text style={styles.proofButtonText}>Lihat Bukti Transfer</Text>
                <Icon
                  name="open-outline"
                  size={16}
                  color={colors.primary || '#007AFF'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Petugas Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Petugas</Text>

          {transaksi.pembayaran && (
            <View style={styles.row}>
              <Text style={styles.label}>Nama Petugas</Text>
              <Text style={styles.value}>{transaksi.nama_petugas}</Text>
            </View>
          )}

          <View style={styles.proofContainer}>
            <Text style={styles.label}>Bukti Pengerjaan Petugas</Text>

            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri:
                  kirim.newbukti_petugas !== null
                    ? kirim.newbukti_petugas
                    : transaksi.bukti_petugas == ''
                    ? 'https://zavalabs.com/noimage.png'
                    : webURL + transaksi.bukti_petugas,
              }}
              style={{
                alignSelf: 'center',
                width: windowWidth / 1.5,
                height: windowWidth / 1.5,
                marginBottom: 10,
              }}
            />

            {kirim.newbukti_petugas == null && (
              <View style={styles.noteContainer}>
                <Text style={styles.label}>Catatan</Text>
                <Text style={styles.noteText}>{transaksi.catatan}</Text>
              </View>
            )}
            <MyGap jarak={10} />
            {kirim.newbukti_petugas == null &&
              transaksi.status !== 'Selesai' && (
                <MyButton
                  title="Upload Bukti Petugas"
                  type="outline"
                  iconColor="white"
                  Icons="camera"
                  onPress={selectImageSource}
                  style={styles.uploadButton}
                />
              )}

            {kirim.newbukti_petugas !== null && (
              <>
                <MyInput
                  label="Catatan"
                  placeholder="Masukan catatan bila perlu"
                  value={kirim.catatan}
                  onChangeText={x => setKirim({...kirim, catatan: x})}
                />
                <MyButton
                  warna={colors.secondary}
                  title="Simpan Gambar"
                  type="outline"
                  iconColor="white"
                  Icons="save"
                  onPress={simpanGambar}
                />
              </>
            )}
          </View>
        </View>
        <MyGap jarak={20} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: colors.white || '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: colors.white || '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 12,
    fontFamily: fonts?.primary?.[600] || 'System',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.secondary || '#666',
    flex: 1,
    fontFamily: fonts?.primary?.[400] || 'System',
  },
  value: {
    fontSize: 14,
    color: colors.text || '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    fontFamily: fonts?.primary?.[500] || 'System',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Book specific styles
  bookInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookCover: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 4,
    fontFamily: fonts?.primary?.[600] || 'System',
  },
  bookAuthor: {
    fontSize: 14,
    color: colors.secondary || '#666',
    marginBottom: 2,
  },
  bookPublisher: {
    fontSize: 14,
    color: colors.secondary || '#666',
    marginBottom: 2,
  },
  bookCategory: {
    fontSize: 14,
    color: colors.secondary || '#666',
    marginBottom: 2,
  },
  bookYear: {
    fontSize: 14,
    color: colors.secondary || '#666',
    marginBottom: 2,
  },
  bookPages: {
    fontSize: 14,
    color: colors.secondary || '#666',
    marginBottom: 2,
  },
  bookType: {
    fontSize: 14,
    color: colors.primary || '#007AFF',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#e0e0e0',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    backgroundColor: colors.primary || '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  // Package specific styles
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  packageIcon: {
    alignItems: 'center',
    marginRight: 16,
    paddingTop: 8,
  },
  packageDetails: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 8,
    fontFamily: fonts?.primary?.[600] || 'System',
  },
  packageDescription: {
    fontSize: 14,
    color: colors.secondary || '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  packageFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text || '#333',
    marginLeft: 8,
    fontFamily: fonts?.primary?.[400] || 'System',
  },
  // Common styles
  divider: {
    height: 1,
    backgroundColor: colors.border || '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text || '#333',
    fontFamily: fonts?.primary?.[600] || 'System',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary || '#007AFF',
    fontFamily: fonts?.primary?.[600] || 'System',
  },
  proofContainer: {
    marginTop: 12,
  },
  proofButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary ? `${colors.primary}10` : '#007AFF10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  proofButtonText: {
    fontSize: 14,
    color: colors.primary || '#007AFF',
    marginLeft: 8,
    marginRight: 8,
    flex: 1,
    fontWeight: '500',
  },
  noteContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#e0e0e0',
  },
  noteText: {
    fontSize: 14,
    color: colors.text || '#333',
    fontStyle: 'italic',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background || '#f5f5f5',
    borderRadius: 8,
  },
});
