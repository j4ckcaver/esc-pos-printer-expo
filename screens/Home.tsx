import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Header from '@/component/home/Header';
import StatusBar from '@/component/common/StatusBar';

const Home = () => {
    return (
        <View style={styles.container}>
            <StatusBar />
            <Header />
        </View>
    );
};

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    }
});

export default Home;
