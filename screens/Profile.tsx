import React from 'react';
import { View } from 'react-native';
import ScreenHeader from '@/component/common/ScreenHeader';
import StatusBar from '@/component/common/StatusBar';

const Profile = () => {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar />
            <ScreenHeader title="Home" />
        </View>
    );
};

export default Profile;
