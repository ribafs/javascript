/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
function J(){this.B=function(e){for(var f=0;24>f;f++)this[String.fromCharCode(97+f)]=e[f]||0;.01>this.c&&(this.c=.01);e=this.b+this.c+this.e;.18>e&&(e=.18/e,this.b*=e,this.c*=e,this.e*=e)}}
var W=new function(){this.A=new J;var e,f,d,h,l,z,K,L,M,A,m,N;this.reset=function(){var b=this.A;h=100/(b.f*b.f+.001);l=100/(b.g*b.g+.001);z=1-b.h*b.h*b.h*.01;K=-b.i*b.i*b.i*1E-6;b.a||(m=.5-b.n/2,N=5E-5*-b.o);L=1+b.l*b.l*(0<b.l?-.9:10);M=0;A=1==b.m?0:(1-b.m)*(1-b.m)*2E4+32};this.D=function(){this.reset();var b=this.A;e=b.b*b.b*1E5;f=b.c*b.c*1E5;d=b.e*b.e*1E5+12;return 3*((e+f+d)/3|0)};this.C=function(b,O){var a=this.A,P=1!=a.s||a.v,r=a.v*a.v*.1,Q=1+3E-4*a.w,n=a.s*a.s*a.s*.1,X=1+1E-4*a.t,Y=1!=a.s,
	Z=a.x*a.x,$=a.g,R=a.q||a.r,aa=a.r*a.r*a.r*.2,D=a.q*a.q*(0>a.q?-1020:1020),S=a.p?((1-a.p)*(1-a.p)*2E4|0)+32:0,ba=a.d,T=a.j/2,ca=a.k*a.k*.01,E=a.a,F=e,da=1/e,ea=1/f,fa=1/d,a=5/(1+a.u*a.u*20)*(.01+n);.8<a&&(a=.8);for(var a=1-a,G=!1,U=0,v=0,w=0,B=0,t=0,x,u=0,g,p=0,s,H=0,c,V=0,q,I=0,C=Array(1024),y=Array(32),k=C.length;k--;)C[k]=0;for(k=y.length;k--;)y[k]=2*Math.random()-1;for(k=0;k<O;k++){if(G)return k;S&&++V>=S&&(V=0,this.reset());A&&++M>=A&&(A=0,h*=L);z+=K;h*=z;h>l&&(h=l,0<$&&(G=!0));g=h;0<T&&(I+=ca,
	g*=1+Math.sin(I)*T);g|=0;8>g&&(g=8);E||(m+=N,0>m?m=0:.5<m&&(m=.5));if(++v>F)switch(v=0,++U){case 1:F=f;break;case 2:F=d}switch(U){case 0:w=v*da;break;case 1:w=1+2*(1-v*ea)*ba;break;case 2:w=1-v*fa;break;case 3:w=0,G=!0}R&&(D+=aa,s=D|0,0>s?s=-s:1023<s&&(s=1023));P&&Q&&(r*=Q,1E-5>r?r=1E-5:.1<r&&(r=.1));q=0;for(var ga=8;ga--;){p++;if(p>=g&&(p%=g,3==E))for(x=y.length;x--;)y[x]=2*Math.random()-1;switch(E){case 0:c=p/g<m?.5:-.5;break;case 1:c=1-p/g*2;break;case 2:c=p/g;c=6.28318531*(.5<c?c-1:c);c=1.27323954*
	c+.405284735*c*c*(0>c?1:-1);c=.225*((0>c?-1:1)*c*c-c)+c;break;case 3:c=y[Math.abs(32*p/g|0)]}P&&(x=u,n*=X,0>n?n=0:.1<n&&(n=.1),Y?(t+=(c-u)*n,t*=a):(u=c,t=0),u+=t,B+=u-x,c=B*=1-r);R&&(C[H%1024]=c,c+=C[(H-s+1024)%1024],H++);q+=c}q=.125*q*w*Z;b[k]=1<=q?32767:-1>=q?-32768:32767*q|0}return O}};
window.jsfxr=function(e){W.A.B(e);var f=W.D();e=new Uint8Array(4*((f+1)/2|0)+44);var f=2*W.C(new Uint16Array(e.buffer,44),f),d=new Uint32Array(e.buffer,0,44);d[0]=1179011410;d[1]=f+36;d[2]=1163280727;d[3]=544501094;d[4]=16;d[5]=65537;d[6]=44100;d[7]=88200;d[8]=1048578;d[9]=1635017060;d[10]=f;for(var f=f+44,d=0,h="data:audio/wav;base64,";d<f;d+=3)var l=e[d]<<16|e[d+1]<<8|e[d+2],h=h+("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>18]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>
	12&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>6&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l&63]);return h};