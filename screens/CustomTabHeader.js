import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
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
} from "../redux/action";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import config from "../config";

const HeadImage = require("../assets/images/HeaderHome.png");
const imageMap = require("../assets/map/tsePark2.png");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const getPark = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${config.API_URL}/places/all`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPark();
  }, []);

  return (
    <SafeAreaView style={{ flex: 0.5 }}>
      <ImageBackground source={HeadImage} style={styles.image}>
        <View style={styles.viewHead}>
          <Text style={styles.textHead1}>หาสถานที่จอดรถของ</Text>
          <Text style={styles.textHead1}>คุณได้เลย!</Text>
        </View>
        <View style={styles.search}>
          <MaterialCommunityIcons
            style={styles.icon}
            name={"magnify"}
            size={20}
            color="#343434"
          />
          <SelectDropdown
            data={data}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index);
              navigation.navigate(
                "TSE_1",
                dispatch(setPark(selectedItem.name)),
                dispatch(setParkInfo(selectedItem.description)),
                dispatch(setParkEmptyslot(selectedItem.quantity)),
                dispatch(setParkLatitude(selectedItem.latitude)),
                dispatch(setParkLongtitude(selectedItem.longtitude)),
                dispatch(setParkImage(selectedItem.img[0])),
                dispatch(setParkImage2(selectedItem.img[1]))
              );
            }}
            defaultButtonText={"จอดไหนดี?"}
            buttonTextAfterSelection={(item, index) => {
              return item.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#035397"}
                  size={15}
                />
              );
            }}
            dropdownIconPosition={"right"}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            selectedRowStyle={styles.dropdown1SelectedRowStyle}
            search
            searchInputStyle={styles.dropdown1searchInputStyleStyle}
            searchPlaceHolder={"Search here"}
            searchPlaceHolderColor={"darkgrey"}
            renderSearchInputLeftIcon={() => {
              return (
                <FontAwesome
                  name={"search"}
                  color={"#343434"}
                  fontFamily="Prompt-Regular"
                  size={18}
                />
              );
            }}
          />
        </View>
      </ImageBackground>
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          height: 5,
          width: "100%",
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: "Prompt-Bold",
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
    left: 3,
    alignSelf: "center",
  },
  search: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 10,
    width: SCREEN_WIDTH / 1.1,
    height: 50,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#035397",
    alignSelf: "center",
    flexDirection: "row",
    fontFamily: "Prompt-Regular",
  },
  dropdown1BtnStyle: {
    width: SCREEN_WIDTH / 1.1,
    height: 48,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FAFAFA",
    width: "93%",
  },
  dropdown1BtnTxtStyle: {
    color: "#343434",
    textAlign: "left",
    bottom: 2,
    left: 10,
    fontFamily: "Prompt-Regular",
  },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF", borderRadius: 10 },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#B3B3B3",
  },
  dropdown1RowTxtStyle: {
    color: "#444",
    textAlign: "left",
    fontFamily: "Prompt-Regular",
  },
  dropdown1SelectedRowStyle: { backgroundColor: "#B3B3B3" },
  dropdown1searchInputStyleStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
});
