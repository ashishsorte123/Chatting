import { useNavigation } from "@react-navigation/core";
import { Auth, DataStore } from "aws-amplify";
import React from "react";
import { Image, Text, View, Pressable } from "react-native";
import { ChatRoom, ChatRoomUser, User } from "../../src/models";
import styles from "./styles";

export default function UserItem({ user }) {
  const navigation = useNavigation();

  const onPress = async () => {
    // create a chatroom
    const newChatRoom = await DataStore.save(new ChatRoom({ newMessages: 0 }));

    // connect authenticated user with the chat room
    const authUser = await Auth.currentAuthenticatedUser();

    const dbUser = await DataStore.query(User, authUser.attributes.sub);

    await DataStore.save(
      new ChatRoomUser({
        user: dbUser,
        chatroom: newChatRoom,
      })
    );
    // connect clicked user with the chat room

    await DataStore.save(
      new ChatRoomUser({
        user,
        chatroom: newChatRoom,
      })
    );

    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{
          uri: user.imageUri,
        }}
        style={styles.image}
      />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}
