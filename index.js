import React,{useEffect,useState} from "react";
import {View,Text,Pressable,StyleSheet,ScrollView,TextInput,Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initial=[
 {id:"1",name:"حليب",price:2500,qty:20,unit:"قطعة"},
 {id:"2",name:"جبنة بيضاء",price:12000,qty:8,unit:"كغ"},
 {id:"3",name:"بهار أبيض",price:0,qty:5,unit:"كغ"}
];

export default function App(){
 const [products,setProducts]=useState(initial),[cart,setCart]=useState([]),[amount,setAmount]=useState("");
 useEffect(()=>{AsyncStorage.getItem("products").then(x=>x&&setProducts(JSON.parse(x)))},[]);
 const save=p=>{setProducts(p);AsyncStorage.setItem("products",JSON.stringify(p));};
 const add=(p)=>setCart(c=>[...c,{...p,cartQty:1}]);
 const total=cart.reduce((s,x)=>s+x.price*x.cartQty,0);
 return <View style={s.container} dir="rtl">
  <ScrollView>
   <Text style={s.title}>محل الألبان</Text>
   <Text style={s.sub}>نقطة البيع وإدارة المحل</Text>
   <View style={s.stats}>
    <View style={s.card}><Text style={s.num}>{total.toLocaleString()}</Text><Text>إجمالي الفاتورة</Text></View>
    <View style={s.card}><Text style={s.num}>{products.length}</Text><Text>الأصناف</Text></View>
   </View>
   <Text style={s.section}>أصناف سريعة</Text>
   {products.map(p=><Pressable key={p.id} style={s.product} onPress={()=>add(p)}>
     <View><Text style={s.pname}>{p.name}</Text><Text>{p.qty} {p.unit}</Text></View>
     <Text style={s.price}>{p.price? p.price.toLocaleString()+" د.ع":"بيع بالمبلغ"}</Text>
   </Pressable>)}
   <Text style={s.section}>بيع مباشر بالمبلغ</Text>
   <View style={s.row}><TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="مثلاً 5000" style={s.input}/><Pressable style={s.button} onPress={()=>{if(amount){setCart(c=>[...c,{id:Date.now().toString(),name:"بيع مباشر",price:Number(amount),cartQty:1,unit:"مبلغ"}]);setAmount("")}}}><Text style={s.buttonText}>إضافة</Text></Pressable></View>
   <Text style={s.section}>الفاتورة الحالية</Text>
   {cart.length===0?<Text style={s.empty}>لا توجد أصناف بعد</Text>:cart.map((x,i)=><View key={i} style={s.line}><Text>{x.name} × {x.cartQty}</Text><Text>{(x.price*x.cartQty).toLocaleString()} د.ع</Text></View>)}
   <View style={s.total}><Text style={s.totalText}>الإجمالي</Text><Text style={s.totalText}>{total.toLocaleString()} د.ع</Text></View>
   <Pressable style={s.checkout} onPress={()=>{if(!cart.length)return;Alert.alert("تم حفظ الفاتورة","الإجمالي: "+total.toLocaleString()+" د.ع");setCart([])}}><Text style={s.checkoutText}>حفظ الفاتورة</Text></Pressable>
   <Text style={s.note}>النسخة الأولى جاهزة للتطوير: الباركود، الوزن، العملاء، الديون، المصروفات والتقارير تُضاف على نفس المشروع.</Text>
  </ScrollView>
 </View>
}
const s=StyleSheet.create({
container:{flex:1,backgroundColor:"#f6fbf7",padding:18,paddingTop:55},title:{fontSize:30,fontWeight:"800",color:"#176b3a"},sub:{fontSize:15,color:"#66736b",marginBottom:18},stats:{flexDirection:"row",gap:10},card:{flex:1,backgroundColor:"#fff",padding:16,borderRadius:16,elevation:2},num:{fontSize:23,fontWeight:"800",marginBottom:5},section:{fontSize:19,fontWeight:"800",marginTop:22,marginBottom:10},product:{backgroundColor:"#fff",padding:16,borderRadius:14,marginBottom:9,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},pname:{fontSize:17,fontWeight:"700"},price:{fontWeight:"700",color:"#176b3a"},row:{flexDirection:"row",gap:8},input:{flex:1,backgroundColor:"#fff",borderRadius:12,padding:14,fontSize:17},button:{backgroundColor:"#176b3a",paddingHorizontal:20,justifyContent:"center",borderRadius:12},buttonText:{color:"#fff",fontWeight:"800"},empty:{color:"#777"},line:{backgroundColor:"#fff",padding:13,marginBottom:5,borderRadius:10,flexDirection:"row",justifyContent:"space-between"},total:{marginTop:10,padding:17,borderRadius:14,backgroundColor:"#e2f2e7",flexDirection:"row",justifyContent:"space-between"},totalText:{fontSize:19,fontWeight:"800"},checkout:{backgroundColor:"#176b3a",padding:17,borderRadius:14,marginTop:12,alignItems:"center"},checkoutText:{color:"#fff",fontSize:18,fontWeight:"800"},note:{marginTop:25,marginBottom:30,color:"#66736b",lineHeight:22}
});