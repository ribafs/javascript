SATMAP_HOME=/home/simon/satmap/
echo "executable"
VERSION="1.7"
TEMP_RELEASEDIR=`mktemp -d`
TEMP="${TEMP_RELEASEDIR}/package.nw"
cd $SATMAP_HOME

zip -r $TEMP ./ -x \*website/\* -x \*ogaunused/\* -x \*.*git/\* -x .gitignore -x build.sh -x \*extraresources/\* -x \*node-webkit/\*
cp node-webkit/nw.exe $TEMP_RELEASEDIR/aussenposten.exe
sed -i 's/udev\.so\.0/udev.so.1/g' node-webkit/nw
cp node-webkit/nw $TEMP_RELEASEDIR/aussenposten
chmod a+x $TEMP_RELEASEDIR/aussenposten
cp node-webkit/*dll $TEMP_RELEASEDIR/
cp node-webkit/*dat $TEMP_RELEASEDIR/
cp node-webkit/nw.pak $TEMP_RELEASEDIR/
cp node-webkit/*so $TEMP_RELEASEDIR/
cp node-webkit/credits.html $TEMP_RELEASEDIR/
cp -r node-webkit/locales/ $TEMP_RELEASEDIR/locales/

cd $TEMP_RELEASEDIR/
zip -r $SATMAP_HOME/website/downloads/aussenposten-${VERSION}-alpha.zip ./
echo "source"
cd $SATMAP_HOME
zip -r website/downloads/aussenposten-src-${VERSION}-alpha.zip ./ -x \*website/\* -x \*.git/\* -x .gitignore -x \*extraresources/\* -x \*node-webkit/\*
