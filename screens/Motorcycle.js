import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  setPark,
  setParkInfo,
  setParkImage,
  setParkImage2,
  setParkEmptyslot,
  setParkLatitude,
  setParkLongtitude,
  setFavoriteList,
} from "../redux/action";
import React, { useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import config from "../config";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const navigation = useNavigation();
  const { favoriteList, parkImage, parkImage2, parkEmptyslot } = useSelector(
    (state) => state.dbReducer
  );
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const getMotorcycle = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${config.API_URL}/places/motorcycle`);
      const json = await response.json();
      setLoading(true);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMotorcycle();
  }, []);

  const totalStars = 5;

  const set = (item) => {
    dispatch(setPark(item.name)),
      dispatch(setParkInfo(item.description)),
      dispatch(setParkEmptyslot(item.quantity)),
      dispatch(setParkLatitude(item.latitude)),
      dispatch(setParkLongtitude(item.longtitude)),
      dispatch(setParkImage(item.img[0])),
      dispatch(setParkImage2(item.img[1]));
  };

  const onFavorite = (book) => {
    if (!favoriteList.includes(book))
      dispatch(setFavoriteList(favoriteList.concat(book)));
  };

  const onRemoveFavorite = (book) => {
    const filteredList = favoriteList.filter(
      (item) => item.place_id !== book.place_id
    );
    dispatch(setFavoriteList(filteredList));
  };

  const ifExists = (book) => {
    if (
      favoriteList.filter((item) => item.place_id === book.place_id).length > 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          contentContainerStyle={{ backgroundColor: "#fff" }}
          renderItem={({ item }) => (
            <View style={styles.btn}>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => navigation.navigate("TSE_1", set(item))}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                  source={{ uri: item.img[0] }}
                />
                <Text style={styles.btnMap}>
                  {item.name + "\n"}
                  <Text style={{ fontSize: 14, color: "#818181" }}>
                    {item.description + "\n"}
                    {Array.from({ length: item.review }, (x, i) => {
                      return (
                        <MaterialIcons
                          key={i}
                          name="star"
                          size={20}
                          color="#FFA000"
                        />
                      );
                    })}
                    {Array.from(
                      { length: totalStars - item.review },
                      (x, i) => {
                        return (
                          <MaterialIcons
                            key={i}
                            name="star-border"
                            size={20}
                            color="#FFA000"
                          />
                        );
                      }
                    )}
                    {item.quantity == 0 ? (
                      <Text style={{ color: "#B70000" }}>
                        {"\n" + "เต็ม                             "}
                      </Text>
                    ) : (
                      <Text style={{ color: "#035397" }}>
                        {"\n" +
                          "จอดได้ " +
                          item.quantity +
                          " ที่                   "}{" "}
                      </Text>
                    )}
                    <TouchableOpacity
                      style={styles.icon}
                      onPress={() =>
                        ifExists(item)
                          ? onRemoveFavorite(item)
                          : onFavorite(item)
                      }
                    >
                      <MaterialIcons
                        name={ifExists(item) ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={"#035397"}
                      />
                    </TouchableOpacity>
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    height: 100,
    alignSelf: "stretch",
    padding: 16,
    margin: 16,
    backgroundColor: "#aa0022",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
  },
  list: {
    alignSelf: "stretch",
  },
  divider: {
    height: 2,
    backgroundColor: "#EBEBEB",
  },
  btnMap: {
    marginLeft: 10,
    alignSelf: "stretch",
    color: "#343434",
    fontSize: 15,
    fontFamily: "Prompt-Regular",
  },
  btn: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#FFF",
    height: 114.5,
    borderBottomColor: "#EBEBEB",
    marginTop: 10,
    width: "95%",
    alignSelf: "center",
  },
  image: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 3,
  },
  viewHead: {
    alignItems: "flex-start",
    marginLeft: SCREEN_WIDTH / 10,
    marginTop: SCREEN_HEIGHT / 15,
  },
  textHead1: {
    color: "#035397",
    fontSize: 24,
    fontWeight: "bold",
  },
  textInput: {
    alignSelf: "stretch",
    fontSize: 16,
    color: "#035397",
    fontWeight: "bold",
    width: "90%",
    left: -2,
  },
  icon: {
    left: 4,
    alignSelf: "center",
  },
  search: {
    alignSelf: "center",
    flexDirection: "row",
    fontSize: 15,
    height: 50,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdown1BtnStyle: {
    width: SCREEN_WIDTH / 1.1,
    height: 50,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#035397",
  },
  dropdown1BtnTxtStyle: { color: "#343434", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF", borderRadius: 10 },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#B3B3B3",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1SelectedRowStyle: { backgroundColor: "#B3B3B3" },
  dropdown1searchInputStyleStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  icon: {
    flexDirection: "row",
    backgroundColor: "#C9C9C9",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
  },
});
